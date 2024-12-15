import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CreateApiUnitRelationDto } from './createApiUnitRelation.dto';

enum NotifyCondition {
  HEALTH_INDEX = 'HEALTH_INDEX',
}

enum HealthStatus {
  RED = 'RED',
  RED_OR_ORANGE = 'RED_OR_ORANGE',
  NOT_GREEN = 'NOT_GREEN',
}

enum IntegrationType {
  GOOGLE = 'GOOGLE',
  CELSIUS = 'CELSIUS',
}

const transformToBoolean = (value: string): boolean => {
  if (value === 'true') {
    return true;
  } else if (value === 'false') {
    return false;
  }
  return true;
};

export class CreateApiRegistryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => Number(value))
  clientId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  clientName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ type: [CreateApiUnitRelationDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateApiUnitRelationDto)
  unitRelations: CreateApiUnitRelationDto[];

  @ApiProperty({
    enum: NotifyCondition,
    description: 'Condição para notificação',
  })
  @IsNotEmpty()
  @IsEnum(NotifyCondition)
  notifyCondition: NotifyCondition;

  @ApiProperty({
    enum: HealthStatus,
    description: 'Status de saúde',
  })
  @IsNotEmpty()
  @IsEnum(HealthStatus)
  healthStatus: HealthStatus;

  @ApiProperty({
    enum: IntegrationType,
    description: 'Tipo de integração',
  })
  @IsNotEmpty()
  @IsEnum(IntegrationType)
  integrationType: IntegrationType;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  triggerId: string;

  @ApiProperty({
    description: 'Em teste (true) ou em produção (false)'
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => transformToBoolean(value))
  isTest: boolean;

  @ApiProperty({
    description: 'Verifica se a API foi descontinuada (false), APIs descontinuadas não aparecem nas listagens'
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => transformToBoolean(value))
  isActive: boolean;

  @ApiProperty({
    description: 'Ativado (true) ou Desativado (false)',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => transformToBoolean(value))
  status: boolean = true;

  @ApiProperty({
    description: 'Data de criação do registro',
    readOnly: true,
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  createdAt?: Date;

  @ApiProperty({
    description: 'Data de última atualização do registro',
    readOnly: true,
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  updatedAt?: Date;
}
