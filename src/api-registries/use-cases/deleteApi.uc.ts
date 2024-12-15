import { Inject, Injectable, Logger } from '@nestjs/common';
import { ApiRegistryGatewayInterface } from '../gateways/apiRegistryInterface.gateway';
import { Request } from 'express';

/**
 * Caso de uso para deletar o registro da API
 *
 * @export
 * @class DeleteApiUseCase
 * @typedef {DeleteApiUseCase}
 */
@Injectable()
export class DeleteApiUseCase {
  private readonly logger = new Logger(DeleteApiUseCase.name);

  constructor(
    @Inject('ApiRegistryPersistenceGateway')
    private apiRegisryPersistenceGateway: ApiRegistryGatewayInterface,
  ) {}

  /**
   * Executa o caso de uso deleteApi
   *
   * @async
   * @param {Request} req
   * @param {number[]} ids
   * @returns {Promise<DeleteApiResponse>}
   */
  async execute(
    req: Request,
    ids: number[],
  ) {
    try {
      return await this.apiRegisryPersistenceGateway.deleteApi(req, ids);
    } catch (error) {
      this.logger.error({
        msg: `Error deleting Api Registry: ${error.message}`,
        params: ids,
        error,
      });
      throw new Error(`Error deleting Api Registry: ${error.message}`);
    }
  }
}
