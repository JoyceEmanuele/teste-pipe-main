import { TestBed } from '@automock/jest';
import { ApiRegistryGatewayInterface } from '../gateways/apiRegistryInterface.gateway';
import { UpdateApiUseCase } from './updateApi.uc';
import { Request } from 'express';
import { generateApiRegistryEntity } from '../../test/factories/apiRegistry';
import { ApiRegistryEntity } from '../entities/apiRegistry.entity';
import { CreateApiUseCase } from './createApi.uc';

describe('UpdateApiUseCase', () => {
  let updateApiUseCase: UpdateApiUseCase;
  let createApiUseCase: CreateApiUseCase;
  let apiPersistenceGateway: jest.Mocked<ApiRegistryGatewayInterface>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(UpdateApiUseCase).compile();
    updateApiUseCase = unit;

    const { unit: createUnit } = TestBed.create(CreateApiUseCase).compile();
    createApiUseCase = createUnit;

    apiPersistenceGateway = unitRef.get('ApiRegistryPersistenceGateway');
  });

  it('should be defined', () => {
    expect(updateApiUseCase).toBeDefined();
  });

  describe('execute', () => {
    it('should update an API registry entity and call updateApi method of ApiRegistryPersistenceGateway', async () => {
      const req: Request = {
        session: {
          user_id: 'devmaster',
        },
      } as any;

      const apiDto = generateApiRegistryEntity();

      const apiEntity = new ApiRegistryEntity(
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

      apiPersistenceGateway.createApiRegistry.mockResolvedValueOnce(apiEntity);

      await createApiUseCase.execute({
        clientId: apiDto.clientId,
        clientName: apiDto.clientName,
        healthStatus: apiDto.healthStatus,
        integrationType: apiDto.integrationType,
        notifyCondition: apiDto.notifyCondition,
        status: apiDto.status,
        isTest: apiDto.isTest,
        isActive: apiDto.isActive,
        title: apiDto.title,
        triggerId: apiDto.triggerId,
        unitRelations: apiDto.unitRelations
      });

      apiPersistenceGateway.updateApi.mockResolvedValueOnce({
        ...apiEntity,
        status: false,
      });

      const result = await updateApiUseCase.execute(req, 1, { status: false });

      expect(result.status).toBe(false);
      expect(apiPersistenceGateway.updateApi).toHaveBeenCalledWith(req, 1, { status: false });
    });

    it('should throw an Error if update operation fails', async () => {
      const req: Request = {
        session: { user_id: 'devmaster' },
      } as any;
    
      apiPersistenceGateway.updateApi.mockRejectedValueOnce(new Error('Database connection error'));
    
      await expect(updateApiUseCase.execute(req, 1, { status: true }))
        .rejects
        .toThrow('Failed to update API registry with ID 1: Database connection error');
    });

    it('should update API registry even with incomplete apiUpdateDto', async () => {
      const req: Request = {
        session: { user_id: 'devmaster' },
      } as any;
    
      const apiDto = generateApiRegistryEntity();
      apiPersistenceGateway.updateApi.mockResolvedValueOnce(apiDto);
    
      const result = await updateApiUseCase.execute(req, 1, { status: true });
    
      expect(result).toEqual(apiDto);
      expect(apiPersistenceGateway.updateApi).toHaveBeenCalledWith(req, 1, { status: true });
    });    
  });
});
