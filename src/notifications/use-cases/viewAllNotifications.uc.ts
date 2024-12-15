import { Inject, Injectable, Logger } from '@nestjs/common';
import { NotificationGatewayInterface } from '../gateways/notificationInterface.gateway';
import { Request } from 'express';

/**
 * Caso de uso para visualizar todas as notificações não visualizadas
 * @date 12/04/2024 - 15:17:33
 *
 * @export
 * @class ViewAllNotificationsUseCase
 * @typedef {ViewAllNotificationsUseCase}
 */
@Injectable()
export class ViewAllNotificationsUseCase {
  private readonly logger = new Logger(ViewAllNotificationsUseCase.name);

  constructor(
    @Inject('NotificationPersistenceGateway')
    private notificationPersistenceGateway: NotificationGatewayInterface, //porta
  ) {}

  /**
   * Executa o caso de uso viewAllNotifications
   * @date 12/04/2024 - 15:19:58
   *
   * @async
   * @param {Request} req
   * @returns {unknown}
   */
  async execute(req: Request) {
    try {
      return await this.notificationPersistenceGateway.viewAllNotifications(
        req,
      );
    } catch (error) {
      this.logger.error({
        msg: `Error Viewing All Notifications: ${error}`,
        error
      });
      throw Error(`Error Viewing All Notifications, ${error}`);
    }
  }
}
