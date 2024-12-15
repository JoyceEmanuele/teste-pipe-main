import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DetectionsMachineHealthDto } from './detectionsMachineHealth.dto';
import { Transform, Type } from 'class-transformer';

export class CreateNotificationMachineHealthDto {
  @ApiProperty({
    type: [DetectionsMachineHealthDto],
    description: 'Lista de detecções energia',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetectionsMachineHealthDto)
  detections: DetectionsMachineHealthDto[];

  @ApiProperty({ type: [String], description: 'Data de detecção' })
  @IsArray()
  @IsString({ each: true })
  destinataryIds: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => (value === 'true' ? true : false))
  isInstantaneous: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  healthIndex: number;
}
