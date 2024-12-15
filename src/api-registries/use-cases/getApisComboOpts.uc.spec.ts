import { TestBed } from '@automock/jest';
import { ApiRegistryGatewayInterface } from '../gateways/apiRegistryInterface.gateway';
import { GetApisComboOptsUseCase } from './getApisComboOpts.uc';

describe('GetApisComboOptsUseCase', () => {
    let getApiUseCase: GetApisComboOptsUseCase;
    let apiPersistenceGateway: jest.Mocked<ApiRegistryGatewayInterface>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(
            GetApisComboOptsUseCase,
        ).compile();
        getApiUseCase = unit;
        apiPersistenceGateway = unitRef.get(
            'ApiRegistryPersistenceGateway',
        );
    });

    it('should be defined', () => {
        expect(
            new GetApisComboOptsUseCase(apiPersistenceGateway),
        ).toBeDefined();
    });

    describe('execute', () => {
        it('should call getApiRegistry method of apiRegistryPersistenceGateway', async () => {
            await getApiUseCase.execute();

            expect(apiPersistenceGateway.getApisComboOpts).toHaveBeenCalledWith();
        });

        it('should log an error and throw if getApiRegistry fails', async () => {
            apiPersistenceGateway.getApisComboOpts.mockRejectedValueOnce(new Error('Database error'));

            await expect(getApiUseCase.execute()).rejects.toThrow('Error Get Apis, Error: Database error');
        });
    });
});
