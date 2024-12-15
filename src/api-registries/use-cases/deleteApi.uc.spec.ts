import { TestBed } from '@automock/jest';
import { ApiRegistryGatewayInterface } from '../gateways/apiRegistryInterface.gateway';
import { Request } from 'express';
import { DeleteApiUseCase } from './deleteApi.uc';

describe('DeleteApiUseCase', () => {
    let deleteApiUseCase: DeleteApiUseCase;
    let apiPersistenceGateway: jest.Mocked<ApiRegistryGatewayInterface>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(
            DeleteApiUseCase,
        ).compile();
        deleteApiUseCase = unit;
        apiPersistenceGateway = unitRef.get(
            'ApiRegistryPersistenceGateway',
        );
    });

    it('should be defined', () => {
        expect(deleteApiUseCase).toBeDefined();
    });

    describe('execute', () => {
        it('should call deleteApi method of apiRegistryPersistenceGateway', async () => {
            const req: Request = {
                session: {
                    user_id: 'devmaster',
                },
            } as any;

            const ids = [1, 2, 3];

            await deleteApiUseCase.execute(req, ids);

            expect(apiPersistenceGateway.deleteApi).toHaveBeenCalledWith(req, ids);
        });

        it('should log an error and throw if deleteApi fails', async () => {
            const req: Request = {
                session: {
                    user_id: 'devmaster',
                },
            } as any;

            const ids = [1, 2, 3];

            apiPersistenceGateway.deleteApi.mockRejectedValueOnce(new Error('Database error'));

            await expect(deleteApiUseCase.execute(req, ids)).rejects.toThrow('Error deleting Api Registry: Database error');
        });
    });
});
