import { NotificationGatewayPrisma } from './notificationPrisma.gateway';
import { PrismaService } from '../../prisma/prisma.service';
import * as factories from '../../test/factories/notifications';
import { ViewNotificationDto } from '../dto/viewNotification.dto';
import { GetNotificationsDto } from '../dto/getNotifications.dto';
import { Request } from 'express';

describe('Notification', () => {
  let notificationGatewayPrisma: NotificationGatewayPrisma;
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = new PrismaService();
    notificationGatewayPrisma = new NotificationGatewayPrisma(prismaService);
    jest.restoreAllMocks();
  });

  describe('Create Notification Energy', () => {
    describe('SUCCESS', () => {
      test('should create a notification energy successfully', async () => {
        const notificationEntity = factories.generateNotificationEntityEnergy();
        const notificationConditions =
          factories.generateNotificationEnergyConditions({
            ID: 1,
            SETPOINT: 50,
            IS_GREATER: true,
            IS_INSTANTANEOUS: true,
          });
        const notificationCreate = factories.generateNotification();

        prismaService.$transaction = jest
          .fn()
          .mockImplementation(async (callback) => {
            await callback(prismaService);
          });

        jest
          .spyOn(prismaService.notificationEnergyConditions, 'create')
          .mockResolvedValue(notificationConditions);
        jest
          .spyOn(prismaService.notification, 'create')
          .mockResolvedValue(notificationCreate);

        for (const destinatary of notificationEntity.destinataryIds) {
          jest
            .spyOn(prismaService.notificationDestinatary, 'create')
            .mockResolvedValue({
              ID: 1,
              NOTIFICATION_ID: notificationCreate.ID,
              DESTINATARY_ID: destinatary,
              IS_VIEWED: false,
            });
        }
        for (const detection of notificationEntity.detections) {
          jest
            .spyOn(prismaService.notificationEnergy, 'create')
            .mockResolvedValue({
              ID: 1,
              NOTIFICATION_ID: notificationCreate.ID,
              NOTIFICATION_CONDITIONS_ID: notificationConditions.ID,
              UNIT_ID: detection.unitId,
              DATE_DETECTION: new Date(detection.dateDetection),
              CONSUMPTION: detection.consumption,
            });
        }

        await notificationGatewayPrisma.createNotificationEnergy(
          notificationEntity,
        );

        expect(
          prismaService.notificationEnergyConditions.create,
        ).toHaveBeenCalled();
        expect(prismaService.notification.create).toHaveBeenCalled();
        expect(
          prismaService.notificationDestinatary.create,
        ).toHaveBeenCalledTimes(notificationEntity.destinataryIds.length);
        expect(prismaService.notificationEnergy.create).toHaveBeenCalledTimes(
          notificationEntity.detections.length,
        );
      });
    });

    describe('ERROR', () => {
      test('should throw Error', async () => {
        const notificationEntity = factories.generateNotificationEntityEnergy();
        const errorMessage = 'Prisma error';
        prismaService.$transaction = jest
          .fn()
          .mockImplementation(async (callback) => {
            await callback(prismaService);
          });

        jest
          .spyOn(prismaService.notificationEnergyConditions, 'create')
          .mockRejectedValue(new Error(errorMessage));

        try {
          await notificationGatewayPrisma.createNotificationEnergy(
            notificationEntity,
          );
          expect(prismaService.notification.create).not.toHaveBeenCalled();
          expect(
            prismaService.notificationDestinatary.create,
          ).not.toHaveBeenCalled();
          expect(
            prismaService.notificationEnergy.create,
          ).not.toHaveBeenCalled();
        } catch (error) {
          expect(error.message).toBe(
            `Error creating notification energy: Error: ${errorMessage}`,
          );
        }
      });
    });
  });

  describe('Create Notification Water', () => {
    describe('SUCCESS', () => {
      test('should create a notification water successfully', async () => {
        const notificationEntity = factories.generateNotificationEntityWater();
        const notificationConditions =
          factories.generateNotificationWaterConditions({
            ID: 1,
            IS_INSTANTANEOUS: true,
          });
        const notificationCreate = factories.generateNotification();

        prismaService.$transaction = jest
          .fn()
          .mockImplementation(async (callback) => {
            await callback(prismaService);
          });

        jest
          .spyOn(prismaService.notificationWaterConditions, 'create')
          .mockResolvedValue(notificationConditions);
        jest
          .spyOn(prismaService.notification, 'create')
          .mockResolvedValue(notificationCreate);

        for (const destinatary of notificationEntity.destinataryIds) {
          jest
            .spyOn(prismaService.notificationDestinatary, 'create')
            .mockResolvedValue({
              ID: 1,
              NOTIFICATION_ID: notificationCreate.ID,
              DESTINATARY_ID: destinatary,
              IS_VIEWED: false,
            });
        }
        for (const detection of notificationEntity.detections) {
          jest
            .spyOn(prismaService.notificationWater, 'create')
            .mockResolvedValue({
              ID: 1,
              NOTIFICATION_ID: notificationCreate.ID,
              NOTIFICATION_CONDITIONS_ID: notificationConditions.ID,
              UNIT_ID: detection.unitId,
              DATE_DETECTION: new Date(detection.dateDetection),
              CONSUMPTION: detection.consumption,
            });
        }

        await notificationGatewayPrisma.createNotificationWater(
          notificationEntity,
        );

        expect(
          prismaService.notificationWaterConditions.create,
        ).toHaveBeenCalled();
        expect(prismaService.notification.create).toHaveBeenCalled();
        expect(
          prismaService.notificationDestinatary.create,
        ).toHaveBeenCalledTimes(notificationEntity.destinataryIds.length);
        expect(prismaService.notificationWater.create).toHaveBeenCalledTimes(
          notificationEntity.detections.length,
        );
      });
    });

    describe('ERROR', () => {
      test('should throw Error', async () => {
        const notificationEntity = factories.generateNotificationEntityWater();
        const errorMessage = 'Prisma error';
        prismaService.$transaction = jest
          .fn()
          .mockImplementation(async (callback) => {
            await callback(prismaService);
          });

        jest
          .spyOn(prismaService.notificationWaterConditions, 'create')
          .mockRejectedValue(new Error(errorMessage));

        try {
          await notificationGatewayPrisma.createNotificationWater(
            notificationEntity,
          );
          expect(prismaService.notification.create).not.toHaveBeenCalled();
          expect(
            prismaService.notificationDestinatary.create,
          ).not.toHaveBeenCalled();
          expect(
            prismaService.notificationWater.create,
          ).not.toHaveBeenCalled();
        } catch (error) {
          expect(error.message).toBe(
            `Error creating notification water: Error: ${errorMessage}`,
          );
        }
      });
    });
  });

  describe('Create Notification Machine Health', () => {
    describe('SUCCESS', () => {
      test('should create a notification machine health index successfully', async () => {
        const notificationEntity = factories.generateNotificationEntityMachineHealth();
        const notificationConditions =
          factories.generateNotificationMachineHealthConditions({
            ID: 1,
            IS_INSTANTANEOUS: true,
            HEALTH_INDEX_ID: 1,
          });
        const notificationCreate = factories.generateNotification();

        prismaService.$transaction = jest
          .fn()
          .mockImplementation(async (callback) => {
            await callback(prismaService);
          });

        jest
          .spyOn(prismaService.notificationMachineHealthConditions, 'create')
          .mockResolvedValue(notificationConditions);
        jest
          .spyOn(prismaService.notification, 'create')
          .mockResolvedValue(notificationCreate);

        for (const destinatary of notificationEntity.destinataryIds) {
          jest
            .spyOn(prismaService.notificationDestinatary, 'create')
            .mockResolvedValue({
              ID: 1,
              NOTIFICATION_ID: notificationCreate.ID,
              DESTINATARY_ID: destinatary,
              IS_VIEWED: false,
            });
        }
        for (const detection of notificationEntity.detections) {
          jest
            .spyOn(prismaService.notificationMachineHealth, 'create')
            .mockResolvedValue({
              ID: 1,
              NOTIFICATION_ID: notificationCreate.ID,
              NOTIFICATION_CONDITIONS_ID: notificationConditions.ID,
              UNIT_ID: detection.unitId,
              DATE_DETECTION: new Date(detection.dateDetection),
              MACHINE_NAME: detection.machineName,
              MACHINE_ID: detection.machineId,
              ASSET_NAME: detection.assetName,
              ASSET_ID: detection.assetId,
              DEVICE_CODE: detection.deviceCode,
              REPORT: detection.report,
            });
        }

        await notificationGatewayPrisma.createNotificationMachineHealth(
          notificationEntity,
        );

        expect(
          prismaService.notificationMachineHealthConditions.create,
        ).toHaveBeenCalled();
        expect(prismaService.notification.create).toHaveBeenCalled();
        expect(
          prismaService.notificationDestinatary.create,
        ).toHaveBeenCalledTimes(notificationEntity.destinataryIds.length);
        expect(prismaService.notificationMachineHealth.create).toHaveBeenCalledTimes(
          notificationEntity.detections.length,
        );
      });
    });

    describe('ERROR', () => {
      test('should throw Error', async () => {
        const notificationEntity = factories.generateNotificationEntityMachineHealth();
        const errorMessage = 'Prisma error';
        prismaService.$transaction = jest
          .fn()
          .mockImplementation(async (callback) => {
            await callback(prismaService);
          });

        jest
          .spyOn(prismaService.notificationMachineHealthConditions, 'create')
          .mockRejectedValue(new Error(errorMessage));

        try {
          await notificationGatewayPrisma.createNotificationMachineHealth(
            notificationEntity,
          );
          expect(prismaService.notification.create).not.toHaveBeenCalled();
          expect(
            prismaService.notificationDestinatary.create,
          ).not.toHaveBeenCalled();
          expect(
            prismaService.notificationMachineHealth.create,
          ).not.toHaveBeenCalled();
        } catch (error) {
          expect(error.message).toBe(
            `Error creating notification machine health index: Error: ${errorMessage}`,
          );
        }
      });
    });
  });

  describe('View Notification', () => {
    describe('SUCCESS', () => {
      test('should view notification successfully', async () => {
        const req: Request = {
          session: {
            user: 'devmaster',
          },
        } as any;
        const notification = factories.generateNotification();
        const notificationDestinatary =
          factories.generateNotificationDestinatary(
            notification.ID,
            req.session['user'],
          );
        const notificationId = notificationDestinatary.NOTIFICATION_ID;
        const viewNotificationDto: ViewNotificationDto = { notificationId };

        jest
          .spyOn(prismaService.notificationDestinatary, 'findUnique')
          .mockResolvedValue(notificationDestinatary);
        jest
          .spyOn(prismaService.notificationDestinatary, 'update')
          .mockResolvedValue(
            factories.generateNotificationViewed(notificationDestinatary),
          );

        const result = await notificationGatewayPrisma.viewNotification(
          viewNotificationDto,
          req,
        );

        expect(result).toEqual(
          `Notification ${notificationId} viewed successfully by ${notificationDestinatary.DESTINATARY_ID}`,
        );
        expect(
          prismaService.notificationDestinatary.findUnique,
        ).toHaveBeenCalledWith({
          where: {
            notificationDestinataryId: {
              DESTINATARY_ID: req.session['user'],
              NOTIFICATION_ID: notificationId,
            },
          },
        });
        expect(
          prismaService.notificationDestinatary.update,
        ).toHaveBeenCalledWith({
          data: { IS_VIEWED: true },
          where: { ID: notificationDestinatary.ID },
        });
      });
    });

    describe('ERROR', () => {
      test('should throw error when notification does not exist', async () => {
        const notification = factories.generateNotification();
        const notificationId = notification.ID;
        const viewNotificationDto: ViewNotificationDto = { notificationId };
        const req: Request = {
          session: {
            user: 'devmaster',
          },
        } as any;

        jest
          .spyOn(prismaService.notificationDestinatary, 'findUnique')
          .mockResolvedValue(null);

        try {
          await notificationGatewayPrisma.viewNotification(
            viewNotificationDto,
            req,
          );
          expect(
            prismaService.notificationDestinatary.findUnique,
          ).toHaveBeenCalledWith({
            where: {
              notificationDestinataryId: {
                DESTINATARY_ID: req.session['user'],
                NOTIFICATION_ID: notificationId,
              },
            },
          });
        } catch (error) {
          expect(error.message).toBe(`Notification does not exists`);
        }
        expect(
          prismaService.notificationDestinatary.findUnique,
        ).toHaveBeenCalledWith({
          where: {
            notificationDestinataryId: {
              DESTINATARY_ID: req.session['user'],
              NOTIFICATION_ID: notificationId,
            },
          },
        });

        jest.spyOn(prismaService.notificationDestinatary, 'update');
        expect(
          prismaService.notificationDestinatary.update,
        ).not.toHaveBeenCalled();
      });

      test('should throw error when prisma.notification.findUnique throws error', async () => {
        const req: Request = {
          session: {
            user: 'devmaster',
          },
        } as any;
        const notification = factories.generateNotification();
        const notificationDestinatary =
          factories.generateNotificationDestinatary(
            notification.ID,
            req.session['user'],
          );
        const notificationId = notificationDestinatary.NOTIFICATION_ID;
        const viewNotificationDto: ViewNotificationDto = { notificationId };
        const errorMessage = 'Prisma error';
        jest
          .spyOn(prismaService.notificationDestinatary, 'findUnique')
          .mockRejectedValue(new Error(errorMessage));

        try {
          await notificationGatewayPrisma.viewNotification(
            viewNotificationDto,
            req,
          );
          expect(
            prismaService.notificationDestinatary.findUnique,
          ).toHaveBeenCalledWith({
            where: {
              notificationDestinataryId: {
                DESTINATARY_ID: req.session['user'],
                NOTIFICATION_ID: notificationId,
              },
            },
          });
          expect(
            prismaService.notificationDestinatary.update,
          ).not.toHaveBeenCalled();
        } catch (error) {
          expect(error.message).toBe(
            `Error findUnique notification, Error: ${errorMessage}`,
          );
        }
      });

      test('should throw error when prisma.notification.update throws error', async () => {
        const req: Request = {
          session: {
            user: 'devmaster',
          },
        } as any;
        const notification = factories.generateNotification();
        const notificationDestinatary =
          factories.generateNotificationDestinatary(
            notification.ID,
            req.session['user'],
          );
        const notificationId = notificationDestinatary.NOTIFICATION_ID;
        const viewNotificationDto: ViewNotificationDto = { notificationId };
        const errorMessage = 'Prisma error';
        jest
          .spyOn(prismaService.notificationDestinatary, 'findUnique')
          .mockResolvedValue(notificationDestinatary);
        jest
          .spyOn(prismaService.notificationDestinatary, 'update')
          .mockRejectedValue(new Error(errorMessage));

        try {
          await notificationGatewayPrisma.viewNotification(
            viewNotificationDto,
            req,
          );
          expect(
            prismaService.notificationDestinatary.findUnique,
          ).toHaveBeenCalledWith({
            where: {
              notificationDestinataryId: {
                DESTINATARY_ID: req.session['user'],
                NOTIFICATION_ID: notificationDestinatary,
              },
            },
          });
          expect(
            prismaService.notificationDestinatary.update,
          ).toHaveBeenCalledWith({
            data: { IS_VIEWED: true },
            where: { ID: notificationDestinatary.ID },
          });
        } catch (error) {
          expect(error.message).toBe(
            `Error view notification, Error: ${errorMessage}`,
          );
        }
      });
    });
  });

  describe('View All Notification', () => {
    describe('SUCCESS', () => {
      test('should view all notifications successfully', async () => {
        const req: Request = {
          session: {
            user_id: 'devmaster',
          },
        } as any;
        jest
          .spyOn(prismaService.notificationDestinatary, 'updateMany')
          .mockImplementation();

        const result =
          await notificationGatewayPrisma.viewAllNotifications(req);

        expect(result).toEqual(`Notifications viewed successfully!`);
        expect(
          prismaService.notificationDestinatary.updateMany,
        ).toHaveBeenCalled();
      });
    });

    describe('ERROR', () => {
      test('should throw error when prisma.notification.updateMany throws error', async () => {
        const req: Request = {
          session: {
            user_id: 'devmaster',
          },
        } as any;
        const errorMessage = 'Prisma error';
        jest
          .spyOn(prismaService.notificationDestinatary, 'updateMany')
          .mockRejectedValue(new Error(errorMessage));

        try {
          await notificationGatewayPrisma.viewAllNotifications(req);
        } catch (error) {
          expect(error.message).toBe(
            `Error view notifications, Error: ${errorMessage}`,
          );
        }
      });
    });
  });

  describe('Get Notificaitions', () => {
    describe('SUCCESS', () => {
      test('should return notifications successfully', async () => {
        const notificationDto: GetNotificationsDto = {
          typeIds: [3],
          subtypeIds: [3],
          unitIds: [1, 2],
          cityIds: ['city_id_1', 'city_id_2'],
          stateIds: ['state_id_1', 'state_id_2'],
          dateStart: '2024-04-19T18:00:00.000Z',
          dateEnd: '2024-04-19T18:00:00.000Z',
          isViewed: false,
        };
        const unitList = [1, 2, 3];
        const req: Request = {
          session: {
            user_id: 'devmaster',
          },
        } as any;

        const mockNotification = {
          ID: 1,
          IS_VIEWED: false,
          DATE_SEND: new Date(),
          NOTIFICATION_SUBTYPE_ID: 1,
          NotificationDestinatary: {
            DESTINATARY_ID: 'devmaster',
          },
          NotificationSubtypes: {
            SUBTYPE_NAME: 'Energia',
            NotificationTypes: {
              ID: 1,
              TYPE_NAME: 'Utilitario',
            },
          },
          NotificationEnergy: {
            UNIT_ID: 1,
            DATE_DETECTION: new Date(),
            CONSUMPTION: 100,
            NotificationEnergyConditions: {
              SETPOINT: 50,
              IS_GREATER: true,
              IS_INSTANTANEOUS: true,
            },
          },
          NotificationWater: {
            UNIT_ID: 1,
            DATE_DETECTION: new Date(),
            CONSUMPTION: 100,
            NotificationEnergyConditions: {
              IS_INSTANTANEOUS: true,
            },
          },
        };

        jest
          .spyOn(prismaService.notification, 'findMany')
          .mockResolvedValue([mockNotification]);
        jest
          .spyOn(prismaService.notification, 'count')
          .mockResolvedValue(1);

        await notificationGatewayPrisma.getNotifications(unitList, notificationDto, req);

        expect(prismaService.notification.findMany).toHaveBeenCalled();
      });
    });

    describe('ERROR', () => {
      test('should throw error when prisma.notification.findMany throws error', async () => {
        const errorMessage = 'Prisma error';
        const notificationDto: GetNotificationsDto = {
          typeIds: [1, 2, 3],
          subtypeIds: [4, 5, 6],
          unitIds: [1, 2],
          cityIds: ['city_id_1', 'city_id_2'],
          stateIds: ['state_id_1', 'state_id_2'],
          dateStart: '2024-04-19T18:00:00.000Z',
          dateEnd: '2024-04-19T18:00:00.000Z',
          isViewed: false,
        };
        const unitList = [1, 2, 3];
        const req: Request = {
          session: {
            user_id: 'devmaster',
          },
        } as any;

        jest
          .spyOn(prismaService.notification, 'findMany')
          .mockRejectedValue(new Error(errorMessage));

        try {
          await notificationGatewayPrisma.getNotifications(
            unitList,
            notificationDto,
            req,
          );
        } catch (error) {
          expect(error.message).toBe(
            `Error findMany notifications, Error: ${errorMessage}`,
          );
        }
      });
    });
  });

  describe('Get Count Notifications', () => {
    describe('SUCCESS', () => {
      test('should Get Count Notifications successfully', async () => {
        const req: Request = {
          session: {
            user_id: 'devmaster',
          },
        } as any;
        jest.spyOn(prismaService.notification, 'count').mockResolvedValue(10);

        const result =
          await notificationGatewayPrisma.getCountNotifications(req);

        expect(typeof result).toBe('number');
        expect(prismaService.notification.count).toHaveBeenCalled();
      });
    });

    describe('ERROR', () => {
      test('should throw error when prisma.notification.count throws error', async () => {
        const req: Request = {
          session: {
            user_id: 'devmaster',
          },
        } as any;
        const errorMessage = 'Prisma error';
        jest
          .spyOn(prismaService.notification, 'count')
          .mockRejectedValue(new Error(errorMessage));

        try {
          await notificationGatewayPrisma.getCountNotifications(req);
        } catch (error) {
          expect(error.message).toBe(
            `Error counting notifications, Error: ${errorMessage}`,
          );
        }
      });
    });
  });
});
