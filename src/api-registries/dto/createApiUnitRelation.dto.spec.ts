import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateApiUnitRelationDto } from './createApiUnitRelation.dto';

describe('CreateApiUnitRelationDto', () => {
  it('should validate successfully when all fields are correct', async () => {
    const dto = {
      unitName: 'unit',
      unitId: 1,
    };
    const createApiUnitRelationDto = plainToInstance(CreateApiUnitRelationDto, dto);
    const errors = await validate(createApiUnitRelationDto);

    expect(errors.length).toBe(0);
  });

  it('should throw validation error when unitId is not a number', async () => {
    const dto = {
      unitId: 'invalid',
    };
    const createApiUnitRelationDto = plainToInstance(CreateApiUnitRelationDto, dto);
    const errors = await validate(createApiUnitRelationDto);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should throw validation error when unitId is empty', async () => {
    const dto = {
    };
    const createApiUnitRelationDto = plainToInstance(CreateApiUnitRelationDto, dto);
    const errors = await validate(createApiUnitRelationDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
  });
});
