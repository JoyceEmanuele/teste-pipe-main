import { ApiProperty } from '@nestjs/swagger';

export class NotificationEnergyEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  notificationSubtypeId: number;

  @ApiProperty()
  dateSend: string | Date;

  @ApiProperty()
  timezoneArea: string;

  @ApiProperty()
  gmt: number;

  @ApiProperty()
  isViewed: boolean;

  @ApiProperty()
  detections: {
    unitId: number;
    dateDetection: string;
    consumption: number;
  }[];

  @ApiProperty()
  destinataryIds: string[];

  @ApiProperty()
  setpoint: number;

  @ApiProperty()
  isGreater: boolean;

  @ApiProperty()
  isInstantaneous: boolean;

  constructor(
    detections: {
      unitId: number;
      dateDetection: string;
      consumption: number;
    }[],
    destinataryIds: string[],
    setpoint: number,
    isGreater: boolean,
    isInstantaneous: boolean,
  ) {
    this.detections = detections;
    this.destinataryIds = destinataryIds;
    this.setpoint = setpoint;
    this.isGreater = isGreater;
    this.isInstantaneous = isInstantaneous;
  }
}
