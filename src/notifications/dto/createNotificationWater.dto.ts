import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DetectionsUtilityDto } from './detectionsUtility.dto';
import { Transform, Type } from 'class-transformer';

export class CreateNotificationWaterDto {
  @ApiProperty({
    type: [DetectionsUtilityDto],
    description: 'Lista de detecções água',
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
  @IsBoolean()
  @Transform(({ value }) => (value === 'true' ? true : false))
  isInstantaneous: boolean;
}
