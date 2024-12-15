import { Inject, Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { CreateApiUseCase } from './createApi.uc';
import { ApiRegistryGatewayInterface } from '../gateways/apiRegistryInterface.gateway';
import { GetApiRegistryDto } from '../dto/getApiRegistry.dto';

/**
 * Caso de uso para visualizar o registro das APIs
 *
 * @export
 * @class GetApisUseCase
 * @typedef {GetApisUseCase}
 */
@Injectable()
export class GetApisUseCase {
    private readonly logger = new Logger(CreateApiUseCase.name);

    constructor(
        @Inject('ApiRegistryPersistenceGateway')
        private apiRegisryPersistenceGateway: ApiRegistryGatewayInterface,
    ) {}

    /**
   * Executa o caso de uso getApi
   *
   * @async
   * @param {GetApiRegistryDto} api
   * @param {Request} req
   * @returns {Promise<GetApiRegistryDtoResponse>}
   */
    async execute(
        api: GetApiRegistryDto,
        req: Request,
    ) {
        try {
            return await this.apiRegisryPersistenceGateway.getApiRegistry(
                req,
                api,
            );
        } catch (error) {
            this.logger.error({
                msg: `Error Get Apis: ${error}`,
                error
            });
            throw Error(`Error Get Apis, ${error}`);
        }
    }
}
