import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { IsNumberArray } from '../../shared/validators/validatorNumber';

const transformToBoolean = (value: string): boolean => {
  if (value === 'false') {
    return false;
  }
    return true;
};

const transformToNumberArray = (value: string[]): number[] => {
  return value
    .map(val => Number(val))
    .filter(val => !isNaN(val));
};

export class GetApiRegistryDto {
  @ApiPropertyOptional({ description: 'IDs dos clientes' })
  @IsOptional()
  @IsArray()
  @Validate(IsNumberArray)
  @Transform(({ value }) => transformToNumberArray(value))
  clientIds?: number[];

  @ApiPropertyOptional({ description: 'Nome do cliente' })
  @IsOptional()
  @IsString()
  clientName?: string;

  @ApiPropertyOptional({ description: 'Título da API' })
  @IsOptional()
  @IsArray()
  title?: string[];

  @ApiPropertyOptional({ description: 'Nome da unidades' })
  @IsOptional()
  @IsArray()
  unitNames?: string[];

  @ApiPropertyOptional({ description: 'Lista de unidades (IDs)' })
  @IsOptional()
  @IsArray()
  @Validate(IsNumberArray)
  @Transform(({ value }) => transformToNumberArray(value))
  unitIds?: number[];

  @ApiPropertyOptional({ description: 'Condição de notificação' })
  @IsOptional()
  @IsArray()
  notifyCondition?: string[];

  @ApiPropertyOptional({ description: 'Status de saúde' })
  @IsOptional()
  @IsArray()
  healthStatus?: string[];

  @ApiPropertyOptional({ description: 'Tipo de integração' })
  @IsOptional()
  @IsArray()
  integrationType?: string[];

  @ApiPropertyOptional({ description: 'Trigger ID' })
  @IsOptional()
  @IsArray()
  triggerId?: string[];

  @ApiPropertyOptional({ description: 'Estado da API (em teste/em produção)' })
  @IsOptional()
  @IsBoolean()
  isTest?: boolean;
  
  @ApiPropertyOptional({ description: 'Status da API (ativado/desativado)' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => transformToBoolean(value))
  status?: boolean;

  @ApiPropertyOptional({ description: 'Data de criação do registro' })
  @IsOptional()
  @IsDateString()
  createdAt?: string;

  @ApiPropertyOptional({ description: 'Data de atualização do registro' })
  @IsOptional()
  @IsDateString()
  updatedAt?: string;

  @ApiPropertyOptional({ description: 'Campo para ordenação (clientId, clientName, title, createdAt, etc.)' })
  @IsOptional()
  @IsString()
  orderBy?: string;

  @ApiPropertyOptional({ description: 'Direção da ordenação (asc ou desc)' })
  @IsOptional()
  @IsString()
  orderDirection?: string;

  @ApiPropertyOptional({ description: 'Número de registros a pular (paginação)' })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Número de registros a buscar (paginação)' })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  limit?: number = 10;
}
