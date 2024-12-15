import { ApiRegistryEntity } from './apiRegistry.entity';
import * as factories from '../../test/factories/apiRegistry';

describe('ApiRegistryEntity', () => {
  let apiRegistryEntity: ApiRegistryEntity;
  
  beforeEach(() => {
    const api = factories.generateApiRegistryEntity();
    apiRegistryEntity = new ApiRegistryEntity(
        api.clientId,
        api.clientName,
        api.title,
        api.unitRelations,
        api.notifyCondition,
        api.healthStatus,
        api.integrationType,
        api.triggerId,
        api.status
    );
  });

  it('should create an instance of ApiRegistryEntity', () => {
    expect(apiRegistryEntity).toBeInstanceOf(ApiRegistryEntity);
  });

  it('should allow changing the status', () => {
    apiRegistryEntity.status = false;
    expect(apiRegistryEntity.status).toBe(false);
  });
});
