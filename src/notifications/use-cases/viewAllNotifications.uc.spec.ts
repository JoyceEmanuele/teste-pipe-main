import { TestBed } from '@automock/jest';
import { NotificationGatewayInterface } from '../gateways/notificationInterface.gateway';
import { ViewAllNotificationsUseCase } from './viewAllNotifications.uc';
import { Request } from 'express';

describe('ViewAllNotificationsUseCase', () => {
  let viewAllNotificationUseCase: ViewAllNotificationsUseCase;
  let notificationPersistenceGateway: jest.Mocked<NotificationGatewayInterface>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(ViewAllNotificationsUseCase).compile();
    viewAllNotificationUseCase = unit;
    notificationPersistenceGateway = unitRef.get('NotificationPersistenceGateway');
  });

  it('should be defined', () => {
    expect(new ViewAllNotificationsUseCase(notificationPersistenceGateway)).toBeDefined();
  });

  describe('execute', () => {
    it('should call viewAllNotifications method of notificationPersistenceGateway', async () => {
      const req: Request = {
        session: {
          user_id: 'devmaster',
        },
      } as any;
      const expectedResult = `Notifications viewed successfully!`;
      notificationPersistenceGateway.viewAllNotifications.mockResolvedValueOnce(expectedResult);

      const result = await viewAllNotificationUseCase.execute(req);

      expect(result).toEqual(expectedResult);
      expect(notificationPersistenceGateway.viewAllNotifications).toHaveBeenCalled();
    });

    it('should throw error if viewAllNotifications method fails', async () => {
      const req: Request = {
        session: {
          user_id: 'devmaster',
        },
      } as any;
      const error = new Error('Mocked error');
      notificationPersistenceGateway.viewAllNotifications.mockRejectedValueOnce(error);

      try {
        await viewAllNotificationUseCase.execute(req);
      } catch (error) {
        expect(error.message).toBe('Error Viewing All Notifications, Error: Mocked error');
      }

      expect(notificationPersistenceGateway.viewAllNotifications).toHaveBeenCalled();
    });
  });
});
