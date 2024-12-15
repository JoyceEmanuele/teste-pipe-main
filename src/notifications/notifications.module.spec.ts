import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsModule } from './notifications.module';
import { NotificationsController } from './notifications.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { NotificationGatewayPrisma } from './gateways/notificationPrisma.gateway';
import { CreateNotificationEnergyUseCase } from './use-cases/createNotificationEnergy.uc';
import { CreateNotificationWaterUseCase } from './use-cases/createNotificationWater.uc';
import { ViewNotificationUseCase } from './use-cases/viewNotification.uc';
import { ViewAllNotificationsUseCase } from './use-cases/viewAllNotifications.uc';
import { GetNotificationsUseCase } from './use-cases/getNotifications.uc';
import { GetCountNotificationsUseCase } from './use-cases/getCountNotifications.uc';
import { AuthGuard } from '../auth/auth.guard';
import { ConfigModule } from '@nestjs/config';
import { CreateNotificationMachineHealthUseCase } from './use-cases/createNotificationMachineHealth.uc';

describe('NotificationsModule', () => {
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
        NotificationsModule,
      ],
      controllers: [NotificationsController],
      providers: [
        NotificationGatewayPrisma,
        {
          provide: 'NotificationPersistenceGateway',
          useExisting: NotificationGatewayPrisma,
        },
        ConfigService,
        CreateNotificationEnergyUseCase,
        CreateNotificationWaterUseCase,
        CreateNotificationMachineHealthUseCase,
        ViewNotificationUseCase,
        ViewAllNotificationsUseCase,
        GetNotificationsUseCase,
        GetCountNotificationsUseCase,
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