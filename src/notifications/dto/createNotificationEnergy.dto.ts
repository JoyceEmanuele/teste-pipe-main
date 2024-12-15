import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DetectionsUtilityDto } from './detectionsUtility.dto';
import { Transform, Type } from 'class-transformer';

export class CreateNotificationEnergyDto {
  @ApiProperty({
    type: [DetectionsUtilityDto],
    description: 'Lista de detecções energia',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetectionsUtilityDto)
  detections: DetectionsUtilityDto[];

  @ApiProperty({ type: [String], description: 'Data de detecção' })
  @IsArray()
  @IsString({ each: true })
  destinataryIds: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  setpoint: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => (value === 'true' ? true : false))
  isGreater: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => (value === 'true' ? true : false))
  isInstantaneous: boolean;
}
