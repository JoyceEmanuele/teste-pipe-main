import { Module } from '@nestjs/common';
import { ApiRegistriesController } from './apiRegistries.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiRegistryGatewayPrisma } from './gateways/apiRegistryPrisma.gateway';
import { AuthGuard } from '../auth/auth.guard';
import { CreateApiUseCase } from './use-cases/createApi.uc';
import { GetApisUseCase } from './use-cases/getApis.uc';
import { DeleteApiUseCase } from './use-cases/deleteApi.uc';
import { UpdateApiUseCase } from './use-cases/updateApi.uc';
import { GetApisComboOptsUseCase } from './use-cases/getApisComboOpts.uc';

/**
 * Módulo de registro de APIs
 *
 * @export
 * @class ApiRegistriesModule
 * @typedef {ApiRegistriesModule}
 */
@Module({
  imports: [
    PrismaModule,
    HttpModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        timeout: 5000,
        maxRedirects: 5,
        baseURL: configService.get('API_GATEWAY_URL'),
      }),
      inject: [ConfigService],
      extraProviders: [ConfigService],
    }),
  ],
  controllers: [ApiRegistriesController],
  providers: [
    ApiRegistryGatewayPrisma,
    {
      provide: 'ApiRegistryPersistenceGateway',
      useExisting: ApiRegistryGatewayPrisma
    },
    ConfigService,
    CreateApiUseCase,
    GetApisUseCase,
    DeleteApiUseCase,
    UpdateApiUseCase,
    GetApisComboOptsUseCase,
    {
      provide: AuthGuard,
      useFactory: (httpService: HttpService) => {
        return new AuthGuard(httpService);
      },
      inject: [HttpService],
    },
  ],
})
export class ApiRegistriesModule {}
