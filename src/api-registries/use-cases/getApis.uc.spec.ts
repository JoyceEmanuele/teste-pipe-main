import { TestBed } from '@automock/jest';
import { GetApisUseCase } from './getApis.uc';
import { ApiRegistryGatewayInterface } from '../gateways/apiRegistryInterface.gateway';
import { Request } from 'express';
import { GetApiRegistryDto } from '../dto/getApiRegistry.dto';

describe('GetApisUseCase', () => {
    let getApiUseCase: GetApisUseCase;
    let apiPersistenceGateway: jest.Mocked<ApiRegistryGatewayInterface>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(
            GetApisUseCase,
        ).compile();
        getApiUseCase = unit;
        apiPersistenceGateway = unitRef.get(
            'ApiRegistryPersistenceGateway',
        );
    });

    it('should be defined', () => {
        expect(
            new GetApisUseCase(apiPersistenceGateway),
        ).toBeDefined();
    });

    describe('execute', () => {
        it('should call getApiRegistry method of apiRegistryPersistenceGateway', async () => {
            const req: Request = {
                session: {
                    user_id: 'devmaster',
                },
            } as any;

            const apiDto: GetApiRegistryDto = {
                clientIds: [1],
            };

            await getApiUseCase.execute(apiDto, req);

            expect(apiPersistenceGateway.getApiRegistry).toHaveBeenCalledWith(req, apiDto);
        });

        it('should log an error and throw if getApiRegistry fails', async () => {
            const req: Request = {
                session: {
                    user_id: 'devmaster',
                },
            } as any;

            const apiDto: GetApiRegistryDto = {
                clientIds: [1],
            };

            apiPersistenceGateway.getApiRegistry.mockRejectedValueOnce(new Error('Database error'));

            await expect(getApiUseCase.execute(apiDto, req)).rejects.toThrow('Error Get Apis, Error: Database error');
        });
    });
});
