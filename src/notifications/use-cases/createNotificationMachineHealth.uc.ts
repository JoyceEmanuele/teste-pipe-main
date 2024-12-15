import { Inject, Injectable, Logger } from '@nestjs/common';
import { NotificationGatewayInterface } from '../gateways/notificationInterface.gateway';
import { NotificationMachineHealthEntity } from '../entities/notificationMachineHealth.entity';
import { CreateNotificationMachineHealthDto } from '../dto/createNotificationMachineHealth.dto';


/**
 * Caso de uso para criar notificação de índice de saúde da máquina
 *
 * @export
 * @class CreateNotificationMachineHealthUseCase
 * @typedef {CreateNotificationMachineHealthUseCase}
 */
@Injectable()
export class CreateNotificationMachineHealthUseCase {
  private readonly logger = new Logger(CreateNotificationMachineHealthUseCase.name);

  constructor(
    @Inject('NotificationPersistenceGateway')
    private notificationPersistenceGateway: NotificationGatewayInterface, //porta
  ) {}

  
  /**
   * Executa o caso de uso createNotificationMachineHealth
   *
   * @async
   * @param {CreateNotificationMachineHealthDto} notification
   * @returns {Promise<NotificationMachineHealthEntity>}
   */
  async execute(
    notification: CreateNotificationMachineHealthDto,
  ): Promise<NotificationMachineHealthEntity> {
    const notificationEntity = new NotificationMachineHealthEntity(
      notification.detections,
      notification.destinataryIds,
      notification.isInstantaneous,
      notification.healthIndex,
    );

    if (notification.detections.length === 0)
      throw new Error('Detections is empty');

    try {
      await this.notificationPersistenceGateway.createNotificationMachineHealth(
        notificationEntity,
      );
    } catch (error) {
      this.logger.error({
        msg: `Error creating Notification MachineHealth: ${error}`,
        params: notification,
        error
      });
      throw Error(`Error creating Notification MachineHealth, ${error}`);
    }
    return notificationEntity;
  }
}
