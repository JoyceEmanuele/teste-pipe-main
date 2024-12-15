import { Inject, Injectable, Logger } from '@nestjs/common';
import { ApiRegistryGatewayInterface } from '../gateways/apiRegistryInterface.gateway';
import { Request } from 'express';
import { CreateApiRegistryDto } from '../dto/createApiRegistry.dto';

/**
 * Caso de uso para atualizar o registro da API
 *
 * @export
 * @class UpdateApiUseCase
 * @typedef {UpdateApiUseCase}
 */
@Injectable()
export class UpdateApiUseCase {
  private readonly logger = new Logger(UpdateApiUseCase.name);

  constructor(
    @Inject('ApiRegistryPersistenceGateway')
    private apiRegisryPersistenceGateway: ApiRegistryGatewayInterface,
  ) {}

    /**
   * Executa o caso de uso updateApi
   *
   * @async
   * @param {Request} req
   * @param {number} id
   * @param {CreateApiRegistryDto} apiUpdateDto
   * @returns {Promise<ApiRegistryEntity>}
   */
  async execute(req: Request, id: number, apiUpdateDto: Partial<CreateApiRegistryDto>, ) {
    try {
        const updatedApi = await this.apiRegisryPersistenceGateway.updateApi(req, id, apiUpdateDto);

        return updatedApi;
      } catch (error) {
        this.logger.error({
          msg: `Error update Api Registry: ${error.message}`,
          params: id,
          api: apiUpdateDto,
          error,
        });
        throw new Error(`Failed to update API registry with ID ${id}: ${error.message}`);
      }
  }
}