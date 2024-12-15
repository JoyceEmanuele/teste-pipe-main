import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { NotificationGatewayPrisma } from './gateways/notificationPrisma.gateway';
import { CreateNotificationEnergyUseCase } from './use-cases/createNotificationEnergy.uc';
import { CreateNotificationWaterUseCase } from './use-cases/createNotificationWater.uc';
import { CreateNotificationMachineHealthUseCase } from './use-cases/createNotificationMachineHealth.uc';
import { ViewNotificationUseCase } from './use-cases/viewNotification.uc';
import { ViewAllNotificationsUseCase } from './use-cases/viewAllNotifications.uc';
import { GetNotificationsUseCase } from './use-cases/getNotifications.uc';
import { GetCountNotificationsUseCase } from './use-cases/getCountNotifications.uc';
import { AuthGuard } from '../auth/auth.guard';

/**
 * Módulo de notificações
 * @date 12/04/2024 - 15:15:45
 *
 * @export
 * @class NotificationsModule
 * @typedef {NotificationsModule}
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
})
export class NotificationsModule {}
