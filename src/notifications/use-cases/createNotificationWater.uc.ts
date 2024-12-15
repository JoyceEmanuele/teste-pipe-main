import { Inject, Injectable, Logger } from '@nestjs/common';
import { NotificationGatewayInterface } from '../gateways/notificationInterface.gateway';
import { NotificationWaterEntity } from '../entities/notificationWater.entity';
import { CreateNotificationWaterDto } from '../dto/createNotificationWater.dto';

/**
 * Caso de uso para criar notificação de água
 * @date 12/04/2024 - 15:16:28
 *
 * @export
 * @class CreateNotificationWaterUseCase
 * @typedef {CreateNotificationWaterUseCase}
 */
@Injectable()
export class CreateNotificationWaterUseCase {
  private readonly logger = new Logger(CreateNotificationWaterUseCase.name);

  constructor(
    @Inject('NotificationPersistenceGateway')
    private notificationPersistenceGateway: NotificationGatewayInterface, //porta
  ) {}

  /**
   * Executa o caso de uso createNotificationWater
   * @date 12/04/2024 - 15:20:39
   *
   * @async
   * @param {CreateNotificationWaterDto} notification
   * @returns {Promise<NotificationWaterEntity>}
   */
  async execute(
    notification: CreateNotificationWaterDto,
  ): Promise<NotificationWaterEntity> {
    const notificationEntity = new NotificationWaterEntity(
      notification.detections,
      notification.destinataryIds,
      notification.isInstantaneous,
    );

    if (notification.detections.length === 0)
      throw new Error('Detections is empty');

    try {
      await this.notificationPersistenceGateway.createNotificationWater(
        notificationEntity,
      );
    } catch (error) {
      this.logger.error({
        msg: `Error creating Notification Water: ${error}`,
        params: notification,
        error
      });
      throw Error(`Error creating Notification Water, ${error}`);
    }
    return notificationEntity;
  }
}
