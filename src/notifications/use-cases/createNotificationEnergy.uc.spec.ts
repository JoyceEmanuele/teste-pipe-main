import { TestBed } from '@automock/jest';
import { NotificationGatewayInterface } from '../gateways/notificationInterface.gateway';
import { CreateNotificationEnergyDto } from '../dto/createNotificationEnergy.dto';
import { NotificationEnergyEntity } from '../entities/notificationEnergy.entity';
import { CreateNotificationEnergyUseCase } from './createNotificationEnergy.uc';

describe('CreateNotificationEnergyUseCase', () => {
  let createNotificationEnergyUseCase: CreateNotificationEnergyUseCase;
  let notificationPersistenceGateway: jest.Mocked<NotificationGatewayInterface>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(
      CreateNotificationEnergyUseCase,
    ).compile();
    createNotificationEnergyUseCase = unit;
    notificationPersistenceGateway = unitRef.get(
      'NotificationPersistenceGateway',
    );
  });

  it('should be defined', () => {
    expect(
      new CreateNotificationEnergyUseCase(notificationPersistenceGateway),
    ).toBeDefined();
  });

  describe('execute', () => {
    it('should create a notification energy entity and call createNotificationEnergy method of notificationPersistenceGateway', async () => {
      const notificationDto: CreateNotificationEnergyDto = {
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
        setpoint: 50,
        isGreater: true,
        isInstantaneous: false,
      };

      const notificationEntity = new NotificationEnergyEntity(
        notificationDto.detections,
        notificationDto.destinataryIds,
        notificationDto.setpoint,
        notificationDto.isGreater,
        notificationDto.isInstantaneous,
      );

      notificationPersistenceGateway.createNotificationEnergy.mockResolvedValueOnce(
        notificationEntity,
      );

      const result =
        await createNotificationEnergyUseCase.execute(notificationDto);

      expect(result).toEqual(notificationEntity);
      expect(
        notificationPersistenceGateway.createNotificationEnergy,
      ).toHaveBeenCalledWith(notificationEntity);
    });

    it('should throw an error if detections array is empty', async () => {
      const notificationDto: CreateNotificationEnergyDto = {
        detections: [],
        destinataryIds: ['devmaster', 'joao@email.com'],
        setpoint: 50,
        isGreater: true,
        isInstantaneous: false,
      };

      try {
        await createNotificationEnergyUseCase.execute(notificationDto);
      } catch (error) {
        expect(error.message).toBe('Detections is empty');
      }
    });

    it('should throw an error if createNotificationEnergy method fails', async () => {
      const notificationDto: CreateNotificationEnergyDto = {
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
        setpoint: 50,
        isGreater: true,
        isInstantaneous: false,
      };

      const error = new Error('Mocked error');
      notificationPersistenceGateway.createNotificationEnergy.mockRejectedValueOnce(
        error,
      );

      try {
        await createNotificationEnergyUseCase.execute(notificationDto);
      } catch (error) {
        expect(error.message).toBe(
          'Error creating Notification Energy, Error: Mocked error',
        );
      }

      expect(
        notificationPersistenceGateway.createNotificationEnergy,
      ).toHaveBeenCalled();
    });
  });
});
