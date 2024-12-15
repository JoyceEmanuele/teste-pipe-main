import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigService } from '@nestjs/config';
import { ApiRegistriesController } from './apiRegistries.controller';
import { ApiRegistryGatewayPrisma } from './gateways/apiRegistryPrisma.gateway';
import { CreateApiUseCase } from './use-cases/createApi.uc';
import { GetApisUseCase } from './use-cases/getApis.uc';
import { DeleteApiUseCase } from './use-cases/deleteApi.uc';
import { UpdateApiUseCase } from './use-cases/updateApi.uc';
import { GetApisComboOptsUseCase } from './use-cases/getApisComboOpts.uc';

describe('ApiRegistriesController', () => {
  let controller: ApiRegistriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, HttpModule],
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
        DeleteApiUseCase,
        UpdateApiUseCase,
        GetApisComboOptsUseCase
      ],
    }).compile();

    controller = module.get<ApiRegistriesController>(ApiRegistriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
