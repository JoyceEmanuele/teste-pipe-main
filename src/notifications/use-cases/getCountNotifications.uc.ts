import { Inject, Injectable, Logger } from '@nestjs/common';
import { NotificationGatewayInterface } from '../gateways/notificationInterface.gateway';
import { Request } from 'express';

/**
 * Caso de uso para obter a quantidade de notificações não visualizadas
 * @date 12/04/2024 - 15:16:43
 *
 * @export
 * @class GetCountNotificationsUseCase
 * @typedef {GetCountNotificationsUseCase}
 */
@Injectable()
export class GetCountNotificationsUseCase {
  private readonly logger = new Logger(GetCountNotificationsUseCase.name);

  constructor(
    @Inject('NotificationPersistenceGateway')
    private notificationPersistenceGateway: NotificationGatewayInterface, //porta
  ) {}

  /**
   * Executa o caso de uso getCountNotifications
   * @date 12/04/2024 - 15:20:28
   *
   * @async
   * @param {Request} req
   * @returns {unknown}
   */
  async execute(req: Request) {
    try {
      return await this.notificationPersistenceGateway.getCountNotifications(
        req,
      );
    } catch (error) {
      this.logger.error({
        msg: `Error findMany notifications: ${error}`,
        error
      });
      throw Error(`Error Get Count Notifications, ${error}`);
    }
  }
}
