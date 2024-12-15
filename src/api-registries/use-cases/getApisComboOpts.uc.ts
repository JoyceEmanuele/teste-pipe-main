import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateApiUseCase } from './createApi.uc';
import { ApiRegistryGatewayInterface, GetApisComboOpts } from '../gateways/apiRegistryInterface.gateway';

/**
 * Caso de uso para buscar os dados que aparecem nas opções de filtros
 *
 * @export
 * @class GetApisComboOptsUseCase
 * @typedef {GetApisComboOptsUseCase}
 */
@Injectable()
export class GetApisComboOptsUseCase {
    private readonly logger = new Logger(CreateApiUseCase.name);

    constructor(
        @Inject('ApiRegistryPersistenceGateway')
        private apiRegisryPersistenceGateway: ApiRegistryGatewayInterface,
    ) {}

     /**
   * Executa o caso de uso getApi
   *
   * @async
   * @returns {Promise<GetApisComboOpts>}
   */
    async execute(): Promise<GetApisComboOpts> {
        try {
            return await this.apiRegisryPersistenceGateway.getApisComboOpts();
        } catch (error) {
            this.logger.error({
                msg: `Error Get Apis: ${error}`,
                error
            });
            throw Error(`Error Get Apis, ${error}`);
        }
    }
}
