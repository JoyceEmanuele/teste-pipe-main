import { TestBed } from '@automock/jest';
import { NotificationGatewayInterface } from '../gateways/notificationInterface.gateway';
import { CreateNotificationWaterDto } from '../dto/createNotificationWater.dto';
import { NotificationWaterEntity } from '../entities/notificationWater.entity';
import { CreateNotificationWaterUseCase } from './createNotificationWater.uc';

describe('CreateNotificationWaterUseCase', () => {
  let createNotificationWaterUseCase: CreateNotificationWaterUseCase;
  let notificationPersistenceGateway: jest.Mocked<NotificationGatewayInterface>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(
      CreateNotificationWaterUseCase,
    ).compile();
    createNotificationWaterUseCase = unit;
    notificationPersistenceGateway = unitRef.get(
      'NotificationPersistenceGateway',
    );
  });

  it('should be defined', () => {
    expect(
      new CreateNotificationWaterUseCase(notificationPersistenceGateway),
    ).toBeDefined();
  });

  describe('execute', () => {
    it('should create a notification water entity and call createNotificationWater method of notificationPersistenceGateway', async () => {
      const notificationDto: CreateNotificationWaterDto = {
        detections: [
          {
            unitId: 155,
            dateDetection: '2024-01-01T00:00:00.000Z',
            consumption: 60,
          },
          {
            unitId: 410,
            dateDetection: '2024-01-01T01:00:00.000Z',
            consumption: 400,
          },
        ],
        destinataryIds: ['devmaster', 'joao@email.com'],
        isInstantaneous: false,
      };

      const notificationEntity = new NotificationWaterEntity(
        notificationDto.detections,
        notificationDto.destinataryIds,
        notificationDto.isInstantaneous,
      );

      notificationPersistenceGateway.createNotificationWater.mockResolvedValueOnce(
        notificationEntity,
      );

      const result =
        await createNotificationWaterUseCase.execute(notificationDto);

      expect(result).toEqual(notificationEntity);
      expect(
        notificationPersistenceGateway.createNotificationWater,
      ).toHaveBeenCalledWith(notificationEntity);
    });

    it('should throw an error if detections array is empty', async () => {
      const notificationDto: CreateNotificationWaterDto = {
        detections: [],
        destinataryIds: ['devmaster', 'joao@email.com'],
        isInstantaneous: false,
      };

      try {
        await createNotificationWaterUseCase.execute(notificationDto);
      } catch (error) {
        expect(error.message).toBe('Detections is empty');
      }
    });

    it('should throw an error if createNotificationWater method fails', async () => {
      const notificationDto: CreateNotificationWaterDto = {
        detections: [
          {
            unitId: 155,
            dateDetection: '2024-01-01T00:00:00.000Z',
            consumption: 60,
          },
          {
            unitId: 410,
            dateDetection: '2024-01-01T01:00:00.000Z',
            consumption: 400,
          },
        ],
        destinataryIds: ['devmaster', 'joao@email.com'],
        isInstantaneous: false,
      };

      const error = new Error('Mocked error');
      notificationPersistenceGateway.createNotificationWater.mockRejectedValueOnce(
        error,
      );

      try {
        await createNotificationWaterUseCase.execute(notificationDto);
      } catch (error) {
        expect(error.message).toBe(
          'Error creating Notification Water, Error: Mocked error',
        );
      }

      expect(
        notificationPersistenceGateway.createNotificationWater,
      ).toHaveBeenCalled();
    });
  });
});
