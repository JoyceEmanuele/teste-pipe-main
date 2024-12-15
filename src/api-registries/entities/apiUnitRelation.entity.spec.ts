import { ApiUnitRelationEntity } from './apiUnitRelation.entity';

describe('ApiUnitRelationEntity', () => {
  let unitRelation: ApiUnitRelationEntity;

  beforeEach(() => {
    unitRelation = new ApiUnitRelationEntity('unit', 1);
  });

  it('should create an instance of ApiUnitRelationEntity', () => {
    expect(unitRelation).toBeInstanceOf(ApiUnitRelationEntity);
  });

  it('should initialize unitId correctly', () => {
    expect(unitRelation.unitId).toBe(1);
  });
});
