import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class DetectionsUtilityDto {
  @ApiProperty({ type: Number, description: 'ID da unidade' })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  unitId: number;

  @ApiProperty({ type: String, description: 'Data de detecção' })
  @IsString()
  dateDetection: string;

  @ApiProperty({ type: Number, description: 'Consumo' })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  consumption: number;
}
