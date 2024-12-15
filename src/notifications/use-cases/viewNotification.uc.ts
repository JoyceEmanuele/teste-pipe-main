import { Inject, Injectable, Logger } from '@nestjs/common';
import { NotificationGatewayInterface } from '../gateways/notificationInterface.gateway';
import { ViewNotificationDto } from '../dto/viewNotification.dto';
import { Request } from 'express';

/**
 * Caso de uso para visualizar notificação
 * @date 12/04/2024 - 15:17:51
 *
 * @export
 * @class ViewNotificationUseCase
 * @typedef {ViewNotificationUseCase}
 */
@Injectable()
export class ViewNotificationUseCase {
  private readonly logger = new Logger(ViewNotificationUseCase.name);

  constructor(
    @Inject('NotificationPersistenceGateway')
    private notificationPersistenceGateway: NotificationGatewayInterface, //porta
  ) {}

  /**
   * Executa o caso de uso viewNotification
   * @date 12/04/2024 - 15:19:26
   *
   * @async
   * @param {ViewNotificationDto} notification
   * @param {Request} req
   * @returns {unknown}
   */
  async execute(notification: ViewNotificationDto, req: Request) {
    try {
      return await this.notificationPersistenceGateway.viewNotification(
        notification,
        req,
      );
    } catch (error) {
      this.logger.error({
        msg: `Error Viewing Notification: ${error}`,
        params: notification,
        error
      });
      throw Error(`Error Viewing Notification, ${error}`);
    }
  }
}
