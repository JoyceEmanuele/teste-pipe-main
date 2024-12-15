import { Inject, Injectable, Logger } from '@nestjs/common';
import { GetNotificationsDto } from '../dto/getNotifications.dto';
import { NotificationGatewayInterface } from '../gateways/notificationInterface.gateway';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { catchError, lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
export interface NotificationResponse {
  id: number;
  typeName: string;
  dateSend: string;
  timezoneArea: string;
  gmt: number;
  energy?: {
    detections: {
      dateDetection: string;
      unitId: number;
      unitName: string;
      consumption: number;
    }[];
    setpoint: number;
    isGreater: boolean;
    isInstantaneous: boolean;
  };
  water?: {
    detections: {
      dateDetection: string;
      unitId: number;
      unitName: string;
      consumption: number;
    }[];
    isInstantaneous: boolean;
  };
  machineHealth?: {
    detections: {
      dateDetection: string;
      unitId: number;
      unitName: string;
      machineName: number;
      machineId: number;
      assetName: string;
      assetId: number;
      deviceCode: string;
      report: string;
    }[];
    isInstantaneous: boolean;
    healthIndex: number;
    healthIndexName: string;
  };
}

export interface NotificationUnitList {
  UNIT_ID: number;
  UNIT_NAME: string;
  CLIENT_NAME: string;
}

/**
 * Caso de uso para listar notificações
 * @date 12/04/2024 - 15:17:12
 *
 * @export
 * @class GetNotificationsUseCase
 * @typedef {GetNotificationsUseCase}
 */
@Injectable()
export class GetNotificationsUseCase {
  private readonly logger = new Logger(GetNotificationsUseCase.name);

  constructor(
    @Inject('NotificationPersistenceGateway')
    private notificationPersistenceGateway: NotificationGatewayInterface, //porta
    @Inject(HttpService)
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Executa o caso de uso getNotifications
   * @date 12/04/2024 - 15:20:16
   *
   * @async
   * @param {GetNotificationsDto} notification
   * @param {Request} req
   * @returns {unknown}
   */
  async execute(notification: GetNotificationsDto, req: Request) {
    if (!req.headers.authorization) {
      throw new Error('No authorization token!');
    }
    let sentence;
    let unitList: NotificationUnitList[];
    let totalItems;
    let notificationsResponse = [] as NotificationResponse[];

    const qParams = this.getFilterParams(notification);

    try {
      unitList = await this.getUnitsList(
        qParams,
        this.configService,
        req.headers.authorization,
      );
    } catch (error) {
      this.logger.error({
        msg: `Error Get Units List in async-api: ${error}`,
        params: notification,
        error,
      });
      throw Error(`Error Get Units List in async-api: ${error}`);
    }

    const unitIds = unitList.map((unit) => unit.UNIT_ID);
    try {
      const response =
        await this.notificationPersistenceGateway.getNotifications(
          unitIds,
          notification,
          req,
        );
      sentence = response.sentence;
      totalItems = response.totalItems;
    } catch (error) {
      this.logger.error({
        msg: `Error Get Notifications: ${error}`,
        params: notification,
        error,
      });
      throw Error(`Error Get Notifications, ${error}`);
    }
    for (const notificationRow of sentence) {
      const detections = this.handleDetections(notificationRow, unitList);
      if (detections.length > 0) {
        notificationsResponse = this.handleNotificationsResponse(
          notificationRow,
          detections,
          notificationsResponse,
          unitList,
        );
      }
    }

    return { notifications: notificationsResponse, totalItems };
  }

  private handleDetections(notificationRow, unitList) {
    const detections = [] as {
      dateDetection: string;
      unitId: number;
      unitName: string;
      clientName: string;
      consumption?: number;
      machineName?: string;
      machineId?: number;
      assetName?: string;
      assetId?: number;
      deviceCode?: string;
      report?: string;
    }[];

    if (notificationRow.NotificationEnergy.length > 0) {
      notificationRow.NotificationEnergy?.forEach((energy) => {
        const unit = unitList.find((unit) => unit.UNIT_ID === energy.UNIT_ID);
        if (unit) {
          detections.push({
            dateDetection: energy.DATE_DETECTION.toISOString(),
            unitId: energy.UNIT_ID,
            unitName: unit.UNIT_NAME,
            clientName: unit.CLIENT_NAME,
            consumption: energy.CONSUMPTION,
          });
        }
      });
    } else if (notificationRow.NotificationWater.length > 0) {
      notificationRow.NotificationWater?.forEach((water) => {
        const unit = unitList.find((unit) => unit.UNIT_ID === water.UNIT_ID);
        if (unit) {
          detections.push({
            dateDetection: water.DATE_DETECTION.toISOString(),
            unitId: water.UNIT_ID,
            unitName: unit.UNIT_NAME,
            clientName: unit.CLIENT_NAME,
            consumption: water.CONSUMPTION,
          });
        }
      });
    } else if (notificationRow.NotificationMachineHealth.length > 0) {
      notificationRow.NotificationMachineHealth?.forEach((machine) => {
        const unit = unitList.find((unit) => unit.UNIT_ID === machine.UNIT_ID);
        if (unit) {
          detections.push({
            dateDetection: machine.DATE_DETECTION.toISOString(),
            unitId: machine.UNIT_ID,
            unitName: unit.UNIT_NAME,
            clientName: unit.CLIENT_NAME,
            machineName: machine.MACHINE_NAME,
            machineId: machine.MACHINE_ID,
            assetName: machine.ASSET_NAME,
            assetId: machine.ASSET_ID,
            deviceCode: machine.DEVICE_CODE,
            report: machine.REPORT,
          });
        }
      });
    }

    return detections;
  }

  private handleNotificationsResponse(
    notificationRow,
    detections,
    notificationsResponse,
    unitList,
  ) {
    if (notificationRow.NotificationEnergy.length > 0) {
      const unitInfo = unitList.find((unit) => unit.UNIT_ID === notificationRow.NotificationEnergy[0].UNIT_ID);
      notificationsResponse.push({
        id: notificationRow.ID,
        typeName: notificationRow.NotificationSubtypes.SUBTYPE_NAME,
        dateSend: notificationRow.DATE_SEND.toISOString(),
        timezoneArea: unitInfo.timezoneArea,
        gmt: unitInfo.gmt,
        energy: {
          detections,
          setpoint:
            notificationRow.NotificationEnergy[0].NotificationEnergyConditions
              .SETPOINT,
          isGreater:
            notificationRow.NotificationEnergy[0].NotificationEnergyConditions
              .IS_GREATER,
          isInstantaneous:
            notificationRow.NotificationEnergy[0].NotificationEnergyConditions
              .IS_INSTANTANEOUS,
        },
      });
    } else if (notificationRow.NotificationWater.length > 0) {
      const unitInfo = unitList.find((unit) => unit.UNIT_ID === notificationRow.NotificationWater[0].UNIT_ID);
      notificationsResponse.push({
        id: notificationRow.ID,
        typeName: notificationRow.NotificationSubtypes.SUBTYPE_NAME,
        dateSend: notificationRow.DATE_SEND.toISOString(),
        timezoneArea: unitInfo.timezoneArea,
        gmt: unitInfo.gmt,
        water: {
          detections,
          isInstantaneous:
            notificationRow.NotificationWater[0].NotificationWaterConditions
              .IS_INSTANTANEOUS,
        },
      });
    } else if (notificationRow.NotificationMachineHealth.length > 0) {
      const unitInfo = unitList.find((unit) => unit.UNIT_ID === notificationRow.NotificationMachineHealth[0].UNIT_ID);
      notificationsResponse.push({
        id: notificationRow.ID,
        typeName: notificationRow.NotificationSubtypes.SUBTYPE_NAME,
        dateSend: notificationRow.DATE_SEND.toISOString(),
        timezoneArea: unitInfo.timezoneArea,
        gmt: unitInfo.gmt,
        machineHealth: {
          detections,
          isInstantaneous:
            notificationRow.NotificationMachineHealth[0].NotificationMachineHealthConditions
              .IS_INSTANTANEOUS,
          healthIndex:
            notificationRow.NotificationMachineHealth[0].NotificationMachineHealthConditions.HEALTH_INDEX_ID,
          healthIndexName:
            notificationRow.NotificationMachineHealth[0].NotificationMachineHealthConditions.NotificationMachineHealthIndexes.HEALTH_INDEX_NAME,
        },
      });
    }
    return notificationsResponse;
  }

  private getFilterParams(notification) {
    return {
      clientIds:
        notification.clientIds && notification.clientIds.length > 0
          ? notification.clientIds
          : null,
      unitIds:
        notification.unitIds && notification.unitIds.length > 0
          ? notification.unitIds
          : null,
      stateIds:
        notification.stateIds && notification.stateIds.length > 0
          ? notification.stateIds
          : null,
      cityIds:
        notification.cityIds && notification.cityIds.length > 0
          ? notification.cityIds
          : null,
    };
  }

  async getUnitsList(qParams, configService: ConfigService, token: string) {
    const { data: unitsData } = await lastValueFrom(
      this.httpService
        .post(
          `${configService.get('API_SERVER_URL')}mainservice/get-units-list`,
          qParams,
          {
            headers: {
              Authorization: token,
              'Content-Type': 'application/json',
            },
          },
        )
        .pipe(
          catchError((error) => {
            this.logger.error({
              msg: `An error happened while getting units list: ${error}`,
              params: qParams,
              error,
            });
            throw new Error(
              `An error happened while getting units list!, ${error}`,
            );
          }),
        ),
    );

    return unitsData;
  }
}
