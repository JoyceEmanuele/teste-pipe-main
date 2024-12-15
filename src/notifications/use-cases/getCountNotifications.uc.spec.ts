import { TestBed } from '@automock/jest';
import { NotificationGatewayInterface } from '../gateways/notificationInterface.gateway';
import { GetCountNotificationsUseCase } from './getCountNotifications.uc';
import { Request } from 'express';

describe('GetCountNotificationsUseCase', () => {
  let getCountNotificationsUseCase: GetCountNotificationsUseCase;
  let notificationPersistenceGateway: jest.Mocked<NotificationGatewayInterface>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(
      GetCountNotificationsUseCase,
    ).compile();
    getCountNotificationsUseCase = unit;
    notificationPersistenceGateway = unitRef.get(
      'NotificationPersistenceGateway',
    );
  });

  it('should be defined', () => {
    expect(
      new GetCountNotificationsUseCase(notificationPersistenceGateway),
    ).toBeDefined();
  });

  describe('execute', () => {
    it('should call getCountNotifications method of notificationPersistenceGateway', async () => {
      const req: Request = {
        session: {
          user_id: 'devmaster',
        },
      } as any;
      const expectedResult = 10;
      notificationPersistenceGateway.getCountNotifications.mockResolvedValueOnce(
        expectedResult,
      );

      const result = await getCountNotificationsUseCase.execute(req);

      expect(result).toEqual(expectedResult);
      expect(
        notificationPersistenceGateway.getCountNotifications,
      ).toHaveBeenCalled();
    });

    it('should throw error if getCountNotifications method fails', async () => {
      const req: Request = {
        session: {
          user_id: 'devmaster',
        },
      } as any;
      const error = new Error('Mocked error');
      notificationPersistenceGateway.getCountNotifications.mockRejectedValueOnce(
        error,
      );

      try {
        await getCountNotificationsUseCase.execute(req);
      } catch (error) {
        expect(error.message).toBe(
          'Error Get Count Notifications, Error: Mocked error',
        );
      }

      expect(
        notificationPersistenceGateway.getCountNotifications,
      ).toHaveBeenCalled();
    });
  });
});
