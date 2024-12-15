import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    @Inject(HttpService)
    private readonly httpService: HttpService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const { data } = await firstValueFrom(
        this.httpService
          .post('/diel-internal/auth/get-user-session', {
            authHeader: `JWT ${token}`,
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(error.response?.data);
              throw new Error('An error happened while getting user session!');
            }),
          ),
      );

      
      // são as informações do usuário logado, os perfis globais e os clientes que ele tem acesso mais:
      request.session = Object.assign(data.session, {
        extraSessionData: data.extraSessionData, // é usado somente no endpoint de simulação de perfil para ver se o usuário pode usar essa funcionalidade
        realUserSession: data.realUserSession, // é usado quando um usuário recebe um link para o DAP e contém a página do front que deve abrir depois que ele fizer login
      })
    } catch (err) {
      this.logger.error(err);
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers?.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
