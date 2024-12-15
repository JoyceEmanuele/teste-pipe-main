import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { CreateNotificationEnergyUseCase } from './use-cases/createNotificationEnergy.uc';
import { ViewNotificationUseCase } from './use-cases/viewNotification.uc';
import { GetNotificationsUseCase } from './use-cases/getNotifications.uc';
import { ViewAllNotificationsUseCase } from './use-cases/viewAllNotifications.uc';
import { GetCountNotificationsUseCase } from './use-cases/getCountNotifications.uc';
import { CreateNotificationWaterUseCase } from './use-cases/createNotificationWater.uc';
import { NotificationGatewayPrisma } from './gateways/notificationPrisma.gateway';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigService } from '@nestjs/config';
import { CreateNotificationMachineHealthUseCase } from './use-cases/createNotificationMachineHealth.uc';

describe('NotificationsController', () => {
  let controller: NotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, HttpModule],
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
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
