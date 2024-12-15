import { Request } from 'express';
import { ApiRegistryEntity } from '../entities/apiRegistry.entity';
import { GetApiRegistryDto } from '../dto/getApiRegistry.dto';
import { CreateApiRegistryDto } from '../dto/createApiRegistry.dto';

/**
 * Porta de uma arquitetura hexagonal que será implementada pelo adapter
 *
 * @export
 * @interface NotificationGatewayInterface
 * @typedef {NotificationGatewayInterface}
 */
export interface ApiRegistryGatewayInterface {
  createApiRegistry(
    api: ApiRegistryEntity,
  ): Promise<ApiRegistryEntity>;
  getApiRegistry(
    req: Request,
    api: GetApiRegistryDto,
  ): Promise<GetApiRegistryDtoResponse>;
  deleteApi(
    req: Request,
    ids: number[]
  ): Promise<DeleteApiResponse>;
  updateApi(
    req: Request,
    id: number,
    api: Partial<CreateApiRegistryDto>
  ): Promise<ApiRegistryEntity>;
  getApisComboOpts(): Promise<GetApisComboOpts>;
}

export interface GetApisComboOpts {
  CLIENTS: { CLIENT_ID: number; CLIENT_NAME: string }[];
  ApiUnitRelations: { UNIT_ID: number; UNIT_NAME: string }[];
  TITLES: string[];
  TRIGGER_IDS: string[];
}

export interface DeleteApiResponse {
  message: string;
  deletedIds: number[];
}

interface ApiRegistryResponse {
  ID: number;
  CLIENT_ID: number;
  CLIENT_NAME: string;
  HEALTH_STATUS: string;
  INTEGRATION_TYPE: string;
  ApiUnitRelations: {
      UNIT_ID: number;
  }[];
  NOTIFY_CONDITION: string;
  STATUS: boolean;
  TITLE: string;
  TRIGGER_ID: string;
}

export interface GetApiRegistryDtoResponse {
  apis: ApiRegistryResponse[];
  totalItems: number;
}