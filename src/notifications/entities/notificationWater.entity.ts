import { ApiProperty } from '@nestjs/swagger';

export class NotificationWaterEntity {
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
  isInstantaneous: boolean;

  constructor(
    detections: {
      unitId: number;
      dateDetection: string;
      consumption: number;
    }[],
    destinataryIds: string[],
    isInstantaneous: boolean,
  ) {
    this.detections = detections;
    this.destinataryIds = destinataryIds;
    this.isInstantaneous = isInstantaneous;
  }
}
