import { TestBed } from '@automock/jest';
import { CreateApiUseCase } from './createApi.uc';
import { ApiRegistryGatewayInterface } from '../gateways/apiRegistryInterface.gateway';
import { generateApiRegistryEntity } from '../../test/factories/apiRegistry';
import { ApiRegistryEntity } from '../entities/apiRegistry.entity';


describe('CreateApiUseCase', () => {
    let createApiUseCase: CreateApiUseCase;
    let apiPersistenceGateway: jest.Mocked<ApiRegistryGatewayInterface>;
  
    beforeAll(() => {
      const { unit, unitRef } = TestBed.create(
        CreateApiUseCase,
      ).compile();
      createApiUseCase = unit;
      apiPersistenceGateway = unitRef.get(
        'ApiRegistryPersistenceGateway',
      );
    });
  
    it('should be defined', () => {
      expect(
        new CreateApiUseCase(apiPersistenceGateway),
      ).toBeDefined();
    });

    describe('execute', () => {
        it('should create a api registry entitty and call createApi method of ApiRegistryPersistenceGateway', async () => {
            const apiDto = generateApiRegistryEntity()

            const apiEntity = new ApiRegistryEntity (
                apiDto.clientId,
                apiDto.clientName,
                apiDto.title,
                apiDto.unitRelations,
                apiDto.notifyCondition,
                apiDto.healthStatus,
                apiDto.integrationType,
                apiDto.triggerId,
                apiDto.status,
            );

            apiPersistenceGateway.createApiRegistry.mockResolvedValueOnce(
                apiEntity
            );

            const result = await createApiUseCase.execute({
                clientId: apiDto.clientId,
                clientName: apiDto.clientName,
                unitRelations: apiDto.unitRelations,
                status: apiDto.status,
                isTest: apiDto.isTest,
                isActive: apiDto.isActive,
                title: apiDto.title,
                triggerId: apiDto.triggerId,
                healthStatus: apiDto.healthStatus,
                integrationType: apiDto.integrationType,
                notifyCondition: apiDto.notifyCondition
            });
            expect(result).toEqual(apiEntity);
            expect(apiPersistenceGateway.createApiRegistry).toHaveBeenCalledWith(apiEntity);
        })
    })

    it('should log an error and throw if createApiRegistry fails', async () => {
        const apiDto = generateApiRegistryEntity();    
        apiPersistenceGateway.createApiRegistry.mockRejectedValueOnce(new Error('Database error'));
    
        await expect(createApiUseCase.execute({
          clientId: apiDto.clientId,
          clientName: apiDto.clientName,
          unitRelations: apiDto.unitRelations,
          status: apiDto.status,
          isTest: apiDto.isTest,
          isActive: apiDto.isActive,
          title: apiDto.title,
          triggerId: apiDto.triggerId,
          healthStatus: apiDto.healthStatus,
          integrationType: apiDto.integrationType,
          notifyCondition: apiDto.notifyCondition
        })).rejects.toThrow('Database error');
    }); 
});