import { TestBed } from '@automock/jest';
import { NotificationGatewayInterface } from '../gateways/notificationInterface.gateway';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { GetNotificationsDto } from '../dto/getNotifications.dto';
import { of } from 'rxjs';
import { GetNotificationsUseCase } from './getNotifications.uc';
import { AxiosRequestHeaders, AxiosResponse } from 'axios';

describe('GetNotificationsUseCase', () => {
  let getNotificationsUseCase: GetNotificationsUseCase;
  let notificationPersistenceGateway: jest.Mocked<NotificationGatewayInterface>;
  let httpService: jest.Mocked<HttpService>;
  let configService: jest.Mocked<ConfigService>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(GetNotificationsUseCase).compile();
    getNotificationsUseCase = unit;
    notificationPersistenceGateway = unitRef.get(
      'NotificationPersistenceGateway',
    );
    configService = unitRef.get(ConfigService);
    httpService = unitRef.get(HttpService);
  });

  it('should be defined', () => {
    expect(getNotificationsUseCase).toBeDefined();
  });

  describe('execute', () => {
    it('should throw an error if authorization token is missing', async () => {
      const notificationDto: GetNotificationsDto = {};

      const mockReq = {
        headers: {},
      } as Request;

      try {
        await getNotificationsUseCase.execute(notificationDto, mockReq);
      } catch (error) {
        expect(error.message).toBe('No authorization token!');
      }
    });

    it('should call getUnitsList and getNotifications methods with correct parameters and return notifications', async () => {
      const mockNotification: GetNotificationsDto = {
        clientIds: [1],
        unitIds: [155, 150],
        stateIds: ['DF', 'RJ'],
        cityIds: ['rj-nova-iguacu', 'rj-rio-de-janeiro', 'sp-sao-paulo'],
        skip: 10,
      };

      const mockReq = {
        headers: {
          authorization: 'Bearer token123',
        },
      } as Request;

      const headers = {
        'Content-Type': 'application/json',
        crossDomain: true,
      } as unknown as AxiosRequestHeaders;

      const response: AxiosResponse<any> = {
        data: [
          { UNIT_ID: 1, UNIT_NAME: 'Unit 1' },
          { UNIT_ID: 2, UNIT_NAME: 'Unit 2' },
        ],
        headers: {},
        config: {
          url: '',
          headers: headers,
        },
        status: 200,
        statusText: 'OK',
      };

      jest.spyOn(httpService, 'post').mockReturnValueOnce(of(response));
      const mockNotifications = [
        {
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
          NotificationMachineHealth: {
            UNIT_ID: 1,
            DATE_DETECTION: new Date(),
            MACHINE_NAME: 'Machine 1',
            MACHINE_ID: 1,
            ASSET_NAME: 'ASSET1',
            ASSET_ID: 123,
            DEVICE_CODE: 'DAC123',
            NotificationMachineHealthConditions: {
              IS_INSTANTANEOUS: true,
              HEALTH_INDEX: 1,
              NotificationMachineHealthIndexes: {
                HEALTH_INDEX_NAME: 'Manutenção Urgente',
              },
            },
          },
        },
      ];
      notificationPersistenceGateway.getNotifications.mockResolvedValueOnce({
        sentence: mockNotifications,
        totalItems: 1,
      });

      await getNotificationsUseCase.execute(mockNotification, mockReq);

      expect(httpService.post).toHaveBeenCalledWith(
        `${configService.get('API_SERVER_URL')}mainservice/get-units-list`,
        {
          clientIds: mockNotification.clientIds,
          unitIds: mockNotification.unitIds,
          stateIds: mockNotification.stateIds,
          cityIds: mockNotification.cityIds,
        },
        {
          headers: {
            Authorization: 'Bearer token123',
            'Content-Type': 'application/json',
          },
        },
      );

      expect(
        notificationPersistenceGateway.getNotifications,
      ).toHaveBeenCalled();
    });
  });
});
