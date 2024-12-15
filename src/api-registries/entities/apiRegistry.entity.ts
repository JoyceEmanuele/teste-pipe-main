import { ApiProperty } from '@nestjs/swagger';
import { ApiUnitRelationEntity } from './apiUnitRelation.entity';

export class ApiRegistryEntity {
  @ApiProperty()
  clientId: number;

  @ApiProperty()
  clientName: string;

  @ApiProperty()
  title: string;

  @ApiProperty({
    description: 'Relações de unidades e máquinas',
    type: [ApiUnitRelationEntity],
  })
  unitRelations: ApiUnitRelationEntity[];

  @ApiProperty({
    enum: ['HEALTH_INDEX'],
    description: 'Condição para notificação',
  })
  notifyCondition: 'HEALTH_INDEX';

  @ApiProperty({
    enum: ['RED', 'RED_OR_ORANGE', 'NOT_GREEN'],
    description: 'Status de saúde',
  })
  healthStatus: 'RED' | 'RED_OR_ORANGE' | 'NOT_GREEN';

  @ApiProperty({
    enum: ['GOOGLE', 'CELSIUS'],
    description: 'Tipo de integração',
  })
  integrationType: 'GOOGLE' | 'CELSIUS';

  @ApiProperty()
  triggerId: string;

  @ApiProperty({
    description: 'Em teste (true) ou em produção (false)',
    default: false,
  })
  isTest: boolean;

  @ApiProperty({
    description: 'Descontinuada (false)',
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Ativado (true) ou Desativado (false)',
    default: true,
  })
  status: boolean;

  @ApiProperty({
    description: 'Data de criação do registro',
    type: String,
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de última atualização do registro',
    type: String,
    format: 'date-time',
  })
  updatedAt: Date;

  constructor(
    clientId: number,
    clientName: string,
    title: string,
    unitRelations: ApiUnitRelationEntity[],
    notifyCondition: 'HEALTH_INDEX',
    healthStatus: 'RED' | 'RED_OR_ORANGE' | 'NOT_GREEN',
    integrationType: 'GOOGLE' | 'CELSIUS',
    triggerId: string,
    isTest: boolean,
    isActive: boolean = true,
    status: boolean = true,
  ) {
    this.clientId = clientId;
    this.clientName = clientName;
    this.title = title;
    this.unitRelations = unitRelations;
    this.notifyCondition = notifyCondition;
    this.healthStatus = healthStatus;
    this.integrationType = integrationType;
    this.triggerId = triggerId;
    this.isTest = isTest;
    this.isActive = isActive;
    this.status = status;
  }
}
