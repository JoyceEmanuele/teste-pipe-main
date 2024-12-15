import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { ApiRegistryGatewayInterface } from '../gateways/apiRegistryInterface.gateway';
import { CreateApiRegistryDto } from '../dto/createApiRegistry.dto';
import { ApiRegistryEntity } from '../entities/apiRegistry.entity';

/**
 * Caso de uso para criar o registro da API
 *
 * @export
 * @class CreateApiUseCase
 * @typedef {CreateApiUseCase}
 */
@Injectable()
export class CreateApiUseCase {
  private readonly logger = new Logger(CreateApiUseCase.name);

  constructor(
    @Inject('ApiRegistryPersistenceGateway')
    private apiRegisryPersistenceGateway: ApiRegistryGatewayInterface,
  ) {}

  /**
   * Executa o caso de uso createApi
   *
   * @async
   * @param {CreateApiRegistryDto} api
   * @returns {Promise<ApiRegistryEntity>}
   */
  async execute(
    api: CreateApiRegistryDto,
  ): Promise<ApiRegistryEntity> {
    const apiEntity = new ApiRegistryEntity(
        api.clientId,
        api.clientName,
        api.title,
        api.unitRelations,
        api.notifyCondition,
        api.healthStatus,
        api.integrationType,
        api.triggerId,
        api.isTest,
        api.status,
    );

    try {
      await this.apiRegisryPersistenceGateway.createApiRegistry(
        apiEntity,
      );
    } catch (error) {
      this.logger.error({
        msg: `Error creating Api Registry: ${error}`,
        params: apiEntity,
        error
      });
      throw new HttpException(error.message || 'An unexpected error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return apiEntity;
  }
}
