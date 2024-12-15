import { TestBed } from '@automock/jest';
import { ViewNotificationDto } from '../dto/viewNotification.dto';
import { NotificationGatewayInterface } from '../gateways/notificationInterface.gateway';
import { ViewNotificationUseCase } from './viewNotification.uc';
import { Request } from 'express';

describe('ViewNotificationUseCasa Test', () => {
  let viewNotificationUseCase: ViewNotificationUseCase;
  let notificationPersistenceGateway: jest.Mocked<NotificationGatewayInterface>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(ViewNotificationUseCase).compile();
    viewNotificationUseCase = unit;
    notificationPersistenceGateway = unitRef.get(
      'NotificationPersistenceGateway',
    );
  });

  it('should be defined', () => {
    expect(
      new ViewNotificationUseCase(notificationPersistenceGateway),
    ).toBeDefined();
  });

  describe('execute', () => {
    it('should call viewNotification method of notificationPersistenceGateway', async () => {
      const notificationDto: ViewNotificationDto = {
        notificationId: 1,
      };
      const req: Request = {
        session: {
          user: 'devmaster',
        },
      } as any;

      const expectedResult = `Notification ${notificationDto.notificationId} viewed successfully!`;
      notificationPersistenceGateway.viewNotification.mockResolvedValueOnce(
        expectedResult,
      );

      const result = await viewNotificationUseCase.execute(notificationDto, req);

      expect(result).toEqual(expectedResult);
      expect(
        notificationPersistenceGateway.viewNotification,
      ).toHaveBeenCalledWith(notificationDto, req);
    });

    it('should throw error if viewNotification method fails', async () => {
      const notificationDto: ViewNotificationDto = {
        notificationId: 1,
      };
      const req: Request = {
        session: {
          user: 'devmaster',
        },
      } as any;

      const error = new Error('Mocked error');
      notificationPersistenceGateway.viewNotification.mockRejectedValueOnce(
        error,
      );

      try {
        await viewNotificationUseCase.execute(notificationDto, req);
      } catch (error) {
        expect(error.message).toBe(
          'Error Viewing Notification, Error: Mocked error',
        );
      }

      expect(
        notificationPersistenceGateway.viewNotification,
      ).toHaveBeenCalledWith(notificationDto, req);
    });
  });
});
