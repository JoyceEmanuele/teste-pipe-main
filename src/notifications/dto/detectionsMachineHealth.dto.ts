import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class DetectionsMachineHealthDto {
  @ApiProperty({ type: Number, description: 'ID da unidade' })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  unitId: number;

  @ApiProperty({ type: String, description: 'Data de detecção' })
  @IsString()
  dateDetection: string;

  @ApiProperty({ type: String, description: 'Nome de máquina' })
  @IsString()
  machineName: string;

  @ApiProperty({ type: Number, description: 'Id da máquina' })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  machineId: number;

  @ApiProperty({ type: String, description: 'Nome do Ativo' })
  @IsString()
  assetName: string;

  @ApiProperty({ type: Number, description: 'Id do ativo' })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  assetId: number;

  @ApiProperty({ type: String, description: 'Id do Dispositivo' })
  @IsString()
  deviceCode: string;

  @ApiProperty({ type: String, description: 'Laudo Técnico' })
  @IsString()
  report: string;
}
