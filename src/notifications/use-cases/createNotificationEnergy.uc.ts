import { Inject, Injectable, Logger } from '@nestjs/common';
import { NotificationGatewayInterface } from '../gateways/notificationInterface.gateway';
import { NotificationEnergyEntity } from '../entities/notificationEnergy.entity';
import { CreateNotificationEnergyDto } from '../dto/createNotificationEnergy.dto';

/**
 * Caso de uso para criar notificação de energia
 * @date 12/04/2024 - 15:16:05
 *
 * @export
 * @class CreateNotificationEnergyUseCase
 * @typedef {CreateNotificationEnergyUseCase}
 */
@Injectable()
export class CreateNotificationEnergyUseCase {
  private readonly logger = new Logger(CreateNotificationEnergyUseCase.name);

  constructor(
    @Inject('NotificationPersistenceGateway')
    private notificationPersistenceGateway: NotificationGatewayInterface, //porta
  ) {}

  /**
   * Executa o caso de uso createNotificationEnergy
   * @date 12/04/2024 - 15:20:48
   *
   * @async
   * @param {CreateNotificationEnergyDto} notification
   * @returns {Promise<NotificationEnergyEntity>}
   */
  async execute(
    notification: CreateNotificationEnergyDto,
  ): Promise<NotificationEnergyEntity> {
    const notificationEntity = new NotificationEnergyEntity(
      notification.detections,
      notification.destinataryIds,
      notification.setpoint,
      notification.isGreater,
      notification.isInstantaneous,
    );

    if (notification.detections.length === 0)
      throw new Error('Detections is empty');

    try {
      await this.notificationPersistenceGateway.createNotificationEnergy(
        notificationEntity,
      );
    } catch (error) {
      this.logger.error({
        msg: `Error creating Notification Energy: ${error}`,
        params: notification,
        error
      });
      throw Error(`Error creating Notification Energy, ${error}`);
    }
    return notificationEntity;
  }
}
