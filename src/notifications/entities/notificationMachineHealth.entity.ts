import { ApiProperty } from '@nestjs/swagger';

export class NotificationMachineHealthEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  notificationSubtypeId: number;

  @ApiProperty()
  dateSend: string | Date;

  @ApiProperty()
  isViewed: boolean;

  @ApiProperty()
  timezoneArea: string;

  @ApiProperty()
  gmt: number;

  @ApiProperty()
  detections: {
    unitId: number;
    dateDetection: string;
    machineName: string;
    machineId: number;
    assetName: string;
    assetId: number;
    deviceCode: string;
    report: string;
  }[];

  @ApiProperty()
  destinataryIds: string[];

  @ApiProperty()
  isInstantaneous: boolean;

  @ApiProperty()
  healthIndex: number;

  constructor(
    detections: {
      unitId: number;
      dateDetection: string;
      machineName: string;
      machineId: number;
      assetName: string;
      assetId: number;
      deviceCode: string;
      report: string;
    }[],
    destinataryIds: string[],
    isInstantaneous: boolean,
    healthIndex: number,
  ) {
    this.detections = detections;
    this.destinataryIds = destinataryIds;
    this.isInstantaneous = isInstantaneous;
    this.healthIndex = healthIndex;
  }
}
