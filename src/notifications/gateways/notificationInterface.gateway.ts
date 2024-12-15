import { GetNotificationsDto } from '../dto/getNotifications.dto';
import { ViewNotificationDto } from '../dto/viewNotification.dto';
import { NotificationEnergyEntity } from '../entities/notificationEnergy.entity';
import { Request } from 'express';
import { NotificationWaterEntity } from '../entities/notificationWater.entity';
import { NotificationMachineHealthEntity } from '../entities/notificationMachineHealth.entity';

//
/**
 * Porta de uma arquitetura hexagonal que será implementada pelo adapter
 * @date 12/04/2024 - 15:10:07
 *
 * @export
 * @interface NotificationGatewayInterface
 * @typedef {NotificationGatewayInterface}
 */
export interface NotificationGatewayInterface {
  createNotificationEnergy(
    notification: NotificationEnergyEntity,
  ): Promise<NotificationEnergyEntity>;
  createNotificationWater(
    notification: NotificationWaterEntity,
  ): Promise<NotificationWaterEntity>;
  createNotificationMachineHealth(
    notification: NotificationMachineHealthEntity,
  ): Promise<NotificationMachineHealthEntity>;
  getNotifications(unitIds: number[], notification: GetNotificationsDto, req: Request);
  viewNotification(notification: ViewNotificationDto, req: Request);
  viewAllNotifications(req: Request);
  getCountNotifications(req: Request);
}
