import { TestBed } from '@automock/jest';
import { NotificationGatewayInterface } from '../gateways/notificationInterface.gateway';
import { CreateNotificationMachineHealthDto } from '../dto/createNotificationMachineHealth.dto';
import { NotificationMachineHealthEntity } from '../entities/notificationMachineHealth.entity';
import { CreateNotificationMachineHealthUseCase } from './createNotificationMachineHealth.uc';

describe('CreateNotificationMachineHealthUseCase', () => {
  let createNotificationMachineHealthUseCase: CreateNotificationMachineHealthUseCase;
  let notificationPersistenceGateway: jest.Mocked<NotificationGatewayInterface>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(
      CreateNotificationMachineHealthUseCase,
    ).compile();
    createNotificationMachineHealthUseCase = unit;
    notificationPersistenceGateway = unitRef.get(
      'NotificationPersistenceGateway',
    );
  });

  it('should be defined', () => {
    expect(
      new CreateNotificationMachineHealthUseCase(notificationPersistenceGateway),
    ).toBeDefined();
  });

  describe('execute', () => {
    it('should create a notification MachineHealth entity and call createNotificationMachineHealth method of notificationPersistenceGateway', async () => {
      const notificationDto: CreateNotificationMachineHealthDto = {
        detections: [
          {
            unitId: 155,
            dateDetection: '2024-01-01T00:00:00.000Z',
            machineName: 'Maquina 1',
            machineId: 1,
            assetName: 'Asset1',
            assetId: 123,
            deviceCode: 'DAC123',
            report: 'Sistema funcionando normalmente',
          },
          {
            unitId: 410,
            dateDetection: '2024-01-01T01:00:00.000Z',
            machineName: 'Maquina 2',
            machineId: 2,
            assetName: 'Asset2',
            assetId: 1234,
            deviceCode: 'DAC1234',
            report: 'Sistema funcionando normalmente',
          },
        ],
        destinataryIds: ['devmaster', 'joao@email.com'],
        isInstantaneous: false,
        healthIndex: 1
      };

      const notificationEntity = new NotificationMachineHealthEntity(
        notificationDto.detections,
        notificationDto.destinataryIds,
        notificationDto.isInstantaneous,
        notificationDto.healthIndex,
      );

      notificationPersistenceGateway.createNotificationMachineHealth.mockResolvedValueOnce(
        notificationEntity,
      );

      const result =
        await createNotificationMachineHealthUseCase.execute(notificationDto);

      expect(result).toEqual(notificationEntity);
      expect(
        notificationPersistenceGateway.createNotificationMachineHealth,
      ).toHaveBeenCalledWith(notificationEntity);
    });

    it('should throw an error if detections array is empty', async () => {
      const notificationDto: CreateNotificationMachineHealthDto = {
        detections: [],
        destinataryIds: ['devmaster', 'joao@email.com'],
        isInstantaneous: false,
        healthIndex: 1
      };

      try {
        await createNotificationMachineHealthUseCase.execute(notificationDto);
      } catch (error) {
        expect(error.message).toBe('Detections is empty');
      }
    });

    it('should throw an error if createNotificationMachineHealth method fails', async () => {
      const notificationDto: CreateNotificationMachineHealthDto = {
        detections: [
          {
            unitId: 155,
            dateDetection: '2024-01-01T00:00:00.000Z',
            machineName: 'Maquina 1',
            machineId: 1,
            assetName: "Asset1",
            assetId: 1234,
            deviceCode: "DAC123",
            report: 'Sistema funcionando normalmente',
          },
          {
            unitId: 410,
            dateDetection: '2024-01-01T01:00:00.000Z',
            machineName: 'Maquina 2',
            machineId: 2,
            assetName: "Asset2",
            assetId: 123,
            deviceCode: "DAC1234",
            report: 'Sistema funcionando normalmente',
          },
        ],
        destinataryIds: ['devmaster', 'joao@email.com'],
        isInstantaneous: false,
        healthIndex: 1
      };

      const error = new Error('Mocked error');
      notificationPersistenceGateway.createNotificationMachineHealth.mockRejectedValueOnce(
        error,
      );

      try {
        await createNotificationMachineHealthUseCase.execute(notificationDto);
      } catch (error) {
        expect(error.message).toBe(
          'Error creating Notification MachineHealth, Error: Mocked error',
        );
      }

      expect(
        notificationPersistenceGateway.createNotificationMachineHealth,
      ).toHaveBeenCalled();
    });
  });
});
