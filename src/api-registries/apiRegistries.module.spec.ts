import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../prisma/prisma.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '../auth/auth.guard';
import { ConfigModule } from '@nestjs/config';
import { ApiRegistriesModule } from './apiRegistries.module';
import { ApiRegistriesController } from './apiRegistries.controller';
import { ApiRegistryGatewayPrisma } from './gateways/apiRegistryPrisma.gateway';
import { CreateApiUseCase } from './use-cases/createApi.uc';
import { GetApisUseCase } from './use-cases/getApis.uc';
import { DeleteApiUseCase } from './use-cases/deleteApi.uc';
import { UpdateApiUseCase } from './use-cases/updateApi.uc';
import { GetApisComboOptsUseCase } from './use-cases/getApisComboOpts.uc';

describe('ApiRegistriesModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
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
        ConfigModule.forRoot(),
        ApiRegistriesModule,
      ],
      controllers: [ApiRegistriesController],
      providers: [
        ApiRegistryGatewayPrisma,
        {
          provide: 'ApiRegistryPersistenceGateway',
          useExisting: ApiRegistryGatewayPrisma,
        },
        ConfigService,
        CreateApiUseCase,
        GetApisUseCase,
        GetApisComboOptsUseCase,
        DeleteApiUseCase,
        UpdateApiUseCase,
        {
          provide: AuthGuard,
          useFactory: (httpService: HttpService) => {
            return new AuthGuard(httpService);
          },
          inject: [HttpService],
        },
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});