import {
  Notification,
  NotificationDestinatary,
  NotificationEnergyConditions,
  NotificationWaterConditions,
  NotificationMachineHealthConditions,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationEnergyEntity } from '../entities/notificationEnergy.entity';
import { NotificationGatewayInterface } from './notificationInterface.gateway';
import { Injectable, Logger } from '@nestjs/common';
import { GetNotificationsDto } from '../dto/getNotifications.dto';
import { ViewNotificationDto } from '../dto/viewNotification.dto';
import { Request } from 'express';
import { NotificationWaterEntity } from '../entities/notificationWater.entity';
import { NotificationMachineHealthEntity } from '../entities/notificationMachineHealth.entity';

/**
 * Apdator do prisma para a porta de notificação
 * @date 12/04/2024 - 15:10:41
 *
 * @export
 * @class NotificationGatewayPrisma
 * @typedef {NotificationGatewayPrisma}
 * @implements {NotificationGatewayInterface}
 */
@Injectable()
export class NotificationGatewayPrisma implements NotificationGatewayInterface {
  private readonly logger = new Logger(NotificationGatewayPrisma.name);
  constructor(private prisma: PrismaService) {}

  /**
   * Criar notificação de Energia
   * @date 12/04/2024 - 14:44:22
   *
   * @async
   * @param {NotificationEnergyEntity} notification
   * @returns {Promise<NotificationEnergyEntity>}
   */
  async createNotificationEnergy(
    notification: NotificationEnergyEntity,
  ): Promise<NotificationEnergyEntity> {
    let notificationCreate: Notification | null = null;
    let notificationConditions: NotificationEnergyConditions | null = null;

    try {
      await this.prisma.$transaction(async (prisma) => {
        notificationConditions =
          await prisma.notificationEnergyConditions.create({
            data: {
              SETPOINT: Number(notification.setpoint),
              IS_GREATER: String(notification.isGreater) === 'true',
              IS_INSTANTANEOUS: String(notification.isInstantaneous) === 'true',
            },
          });

        notificationCreate = await prisma.notification.create({
          data: {
            NOTIFICATION_SUBTYPE_ID: 3,
          },
        });

        for (const destinatary of notification.destinataryIds) {
          await prisma.notificationDestinatary.create({
            data: {
              NOTIFICATION_ID: notificationCreate.ID,
              DESTINATARY_ID: destinatary,
            },
          });
        }

        for (const detection of notification.detections) {
          await prisma.notificationEnergy.create({
            data: {
              NOTIFICATION_ID: notificationCreate.ID,
              NOTIFICATION_CONDITIONS_ID: notificationConditions.ID,
              UNIT_ID: Number(detection.unitId),
              DATE_DETECTION: detection.dateDetection,
              CONSUMPTION: Number(detection.consumption),
            },
          });
        }
      });
    } catch (error) {
      this.logger.error({
        msg: `Error creating notification energy: ${error}`,
        params: notification,
        error,
      });
      throw new Error(`Error creating notification energy: ${error}`);
    }

    return notification;
  }

  /**
   * Criar notificação de Água
   * @date 12/04/2024 - 14:46:07
   *
   * @async
   * @param {NotificationWaterEntity} notification
   * @returns {Promise<NotificationWaterEntity>}
   */
  async createNotificationWater(
    notification: NotificationWaterEntity,
  ): Promise<NotificationWaterEntity> {
    let notificationCreate: Notification | null = null;
    let notificationConditions: NotificationWaterConditions | null = null;

    try {
      await this.prisma.$transaction(async (prisma) => {
        notificationConditions =
          await prisma.notificationWaterConditions.create({
            data: {
              IS_INSTANTANEOUS: String(notification.isInstantaneous) === 'true',
            },
          });

        notificationCreate = await prisma.notification.create({
          data: {
            NOTIFICATION_SUBTYPE_ID: 4,
          },
        });

        for (const destinatary of notification.destinataryIds) {
          await prisma.notificationDestinatary.create({
            data: {
              NOTIFICATION_ID: notificationCreate.ID,
              DESTINATARY_ID: destinatary,
            },
          });
        }

        for (const detection of notification.detections) {
          await prisma.notificationWater.create({
            data: {
              NOTIFICATION_ID: notificationCreate.ID,
              NOTIFICATION_CONDITIONS_ID: notificationConditions.ID,
              UNIT_ID: Number(detection.unitId),
              DATE_DETECTION: detection.dateDetection,
              CONSUMPTION: Number(detection.consumption),
            },
          });
        }
      });
    } catch (error) {
      this.logger.error({
        msg: `Error creating notification water: ${error}`,
        params: notification,
        error,
      });
      throw new Error(`Error creating notification water: ${error}`);
    }

    return notification;
  }

  /**
   * Criar notificação de Água
   * @date 12/04/2024 - 14:46:07
   *
   * @async
   * @param {NotificationMachineHealthEntity} notification
   * @returns {Promise<NotificationMachineHealthEntity>}
   */
  async createNotificationMachineHealth(
    notification: NotificationMachineHealthEntity,
  ): Promise<NotificationMachineHealthEntity> {
    let notificationCreate: Notification | null = null;
    let notificationConditions: NotificationMachineHealthConditions | null =
      null;

    try {
      await this.prisma.$transaction(async (prisma) => {
        notificationConditions =
          await prisma.notificationMachineHealthConditions.create({
            data: {
              IS_INSTANTANEOUS: String(notification.isInstantaneous) === 'true',
              HEALTH_INDEX_ID: Number(notification.healthIndex),
            },
          });

        notificationCreate = await prisma.notification.create({
          data: {
            NOTIFICATION_SUBTYPE_ID: 5,
          },
        });

        for (const destinatary of notification.destinataryIds) {
          await prisma.notificationDestinatary.create({
            data: {
              NOTIFICATION_ID: notificationCreate.ID,
              DESTINATARY_ID: destinatary,
            },
          });
        }

        for (const detection of notification.detections) {
          await prisma.notificationMachineHealth.create({
            data: {
              NOTIFICATION_ID: notificationCreate.ID,
              NOTIFICATION_CONDITIONS_ID: notificationConditions.ID,
              UNIT_ID: Number(detection.unitId),
              DATE_DETECTION: detection.dateDetection,
              MACHINE_NAME: detection.machineName,
              MACHINE_ID: Number(detection.machineId),
              ASSET_NAME: detection.assetName,
              ASSET_ID: Number(detection.assetId),
              DEVICE_CODE: detection.deviceCode,
              REPORT: detection.report,
            },
          });
        }
      });
    } catch (error) {
      this.logger.error({
        msg: `Error creating notification machine health index: ${error}`,
        params: notification,
        error,
      });
      throw new Error(
        `Error creating notification machine health index: ${error}`,
      );
    }

    return notification;
  }

  /**
   * Visualizar notificação
   * @date 12/04/2024 - 14:48:24
   *
   * @async
   * @param {ViewNotificationDto} notification
   * @param {Request} req
   * @returns {Promise<string>}
   */
  async viewNotification(
    notification: ViewNotificationDto,
    req: Request,
  ): Promise<string> {
    let notificationExists: NotificationDestinatary | null;
    const destinataryId = req.session['user'];
    try {
      notificationExists = await this.prisma.notificationDestinatary.findUnique(
        {
          where: {
            notificationDestinataryId: {
              DESTINATARY_ID: destinataryId,
              NOTIFICATION_ID: Number(notification.notificationId),
            },
          },
        },
      );
    } catch (error) {
      this.logger.error({
        msg: `Error findUnique notification: ${error}`,
        params: notification,
        error,
      });
      throw Error(`Error findUnique notification, ${error}`);
    }

    if (!notificationExists) {
      throw new Error('Notification does not exists');
    }

    try {
      await this.prisma.notificationDestinatary.update({
        data: { IS_VIEWED: true },
        where: {
          ID: notificationExists.ID,
        },
      });
    } catch (error) {
      this.logger.error({
        msg: `Error view notification: ${error}`,
        params: notification,
        error,
      });
      throw Error(`Error view notification, ${error}`);
    }

    return `Notification ${notification.notificationId} viewed successfully by ${notificationExists.DESTINATARY_ID}`;
  }

  /**
   * Visualizar todas as notificações
   * @date 12/04/2024 - 14:48:54
   *
   * @async
   * @param {Request} req
   * @returns {Promise<string>}
   */
  async viewAllNotifications(req: Request): Promise<string> {
    const destinataryId = req.session['user'];
    try {
      await this.prisma.notificationDestinatary.updateMany({
        data: {
          IS_VIEWED: true,
        },
        where: {
          IS_VIEWED: false,
          DESTINATARY_ID: destinataryId,
        },
      });
    } catch (error) {
      this.logger.error({
        msg: `Error view notifications: ${error}`,
        error,
      });
      throw Error(`Error view notifications, ${error}`);
    }

    return `Notifications viewed successfully!`;
  }

  /**
   * Listar notificações
   * @date 12/04/2024 - 14:49:17
   *
   * @async
   * @param {GetNotificationsDto} notification
   * @param {Request} req
   * @returns {unknown}
   */
  async getNotifications(
    unitIds: number[],
    notification: GetNotificationsDto,
    req: Request,
  ) {
    const {
      getTypeIds,
      getSubtypeIds,
      getStartDate,
      getEndDate,
      getViewedNotifications,
      getSkip,
    } = this.handleFilters(notification);
    try {
      const dest = req.session['user'];
      const where = {
        NOTIFICATION_SUBTYPE_ID: {
          in: getSubtypeIds,
        },
        NotificationSubtypes: {
          NOTIFICATION_TYPE_ID: {
            in: getTypeIds,
          },
        },
        DATE_SEND: {
          gte: getStartDate,
          lte: getEndDate,
        },
        NotificationDestinatary: {
          some: {
            DESTINATARY_ID: dest,
            IS_VIEWED: getViewedNotifications,
          },
        },
        OR: [
          {
            NotificationEnergy: {
              some: {
                UNIT_ID: {
                  in: unitIds,
                },
              },
            },
          },
          {
            NotificationWater: {
              some: {
                UNIT_ID: {
                  in: unitIds,
                },
              },
            },
          },
          {
            NotificationMachineHealth: {
              some: {
                UNIT_ID: {
                  in: unitIds,
                },
              },
            },
          },
        ],
      };

      const sentence = await this.prisma.notification.findMany({
        select: {
          ID: true,
          DATE_SEND: true,
          NOTIFICATION_SUBTYPE_ID: true,
          NotificationDestinatary: {
            select: {
              DESTINATARY_ID: true,
              IS_VIEWED: true,
            },
            where: {
              DESTINATARY_ID: dest,
              IS_VIEWED: getViewedNotifications,
            },
          },
          NotificationSubtypes: {
            select: {
              SUBTYPE_NAME: true,
              NotificationTypes: {
                select: {
                  ID: true,
                  TYPE_NAME: true,
                },
              },
            },
          },
          NotificationEnergy: {
            select: {
              UNIT_ID: true,
              DATE_DETECTION: true,
              CONSUMPTION: true,
              NotificationEnergyConditions: {
                select: {
                  SETPOINT: true,
                  IS_GREATER: true,
                  IS_INSTANTANEOUS: true,
                },
              },
            },
          },
          NotificationWater: {
            select: {
              UNIT_ID: true,
              DATE_DETECTION: true,
              CONSUMPTION: true,
              NotificationWaterConditions: {
                select: {
                  IS_INSTANTANEOUS: true,
                },
              },
            },
          },
          NotificationMachineHealth: {
            select: {
              UNIT_ID: true,
              DATE_DETECTION: true,
              MACHINE_NAME: true,
              MACHINE_ID: true,
              ASSET_NAME: true,
              ASSET_ID: true,
              DEVICE_CODE: true,
              REPORT: true,
              NotificationMachineHealthConditions: {
                select: {
                  IS_INSTANTANEOUS: true,
                  HEALTH_INDEX_ID: true,
                  NotificationMachineHealthIndexes: {
                    select: {
                      HEALTH_INDEX_NAME: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { DATE_SEND: 'desc' },
        skip: getSkip,
        take: 10,
        where: where,
      });

      const totalItems = await this.prisma.notification.count({ where: where });
      return { sentence, totalItems };
    } catch (error) {
      this.logger.error({
        msg: `Error findMany notifications: ${error}`,
        params: notification,
        error,
      });
      throw Error(`Error findMany notifications, ${error}`);
    }
  }

  /**
   * Retornar quantidade de Notificações não visualizadas
   * @date 12/04/2024 - 14:50:26
   *
   * @async
   * @param {Request} req
   * @returns {unknown}
   */
  async getCountNotifications(req: Request) {
    const dest = req.session['user'];
    try {
      const sentence = await this.prisma.notification.count({
        where: {
          NotificationDestinatary: {
            some: {
              DESTINATARY_ID: dest,
              IS_VIEWED: false,
            },
          },
        },
      });
      return sentence;
    } catch (error) {
      this.logger.error({
        msg: `Error counting notifications: ${error}`,
        error,
      });
      throw Error(`Error counting notifications, ${error}`);
    }
  }

  /**
   * Tratamento de parâmetros para filtrar notificações
   * @date 12/04/2024 - 14:49:48
   *
   * @param {GetNotificationsDto} notification
   * @returns {{ getTypeIds: {}; getSubtypeIds: {}; getStartDate: any; getEndDate: any; getViewedNotifications: boolean; }}
   */
  handleFilters(notification: GetNotificationsDto) {
    let getTypeIds = undefined as number[] | undefined;
    let getSubtypeIds = undefined as number[] | undefined;
    let getStartDate = undefined as Date | undefined;
    let getEndDate = undefined as Date | undefined;

    if (notification.typeIds && notification.typeIds.length > 0)
      getTypeIds = notification.typeIds.map((id) => Number(id));
    if (notification.subtypeIds && notification.subtypeIds.length > 0)
      getSubtypeIds = notification.subtypeIds.map((id) => Number(id));
    if (notification.dateStart && notification.dateEnd) {
      getStartDate = new Date(`${notification.dateStart}T00:00:00-03:00`);
      getEndDate = new Date(`${notification.dateEnd}T23:59:59-03:00`);
    }
    const getViewedNotifications = notification.isViewed
      ? String(notification.isViewed) === 'true'
      : undefined;

    const getSkip = Number(notification.skip);

    return {
      getTypeIds,
      getSubtypeIds,
      getStartDate,
      getEndDate,
      getViewedNotifications,
      getSkip,
    };
  }
}
