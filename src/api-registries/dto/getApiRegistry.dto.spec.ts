import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { GetApiRegistryDto } from './getApiRegistry.dto';

describe('GetApiRegistryDto', () => {
  let dto: GetApiRegistryDto;

  beforeEach(() => {
    dto = new GetApiRegistryDto();
  });

  it('should validate clientId as a number', async () => {
    dto = plainToInstance(GetApiRegistryDto, { clientIds: [1] });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate unitIds as an array of numbers', async () => {
    dto = plainToInstance(GetApiRegistryDto, { unitIds: ['1', '2', '3'] });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
    expect(dto.unitIds).toEqual([1, 2, 3]);
  });

  it('should transform status to boolean (true)', async () => {
    dto = plainToInstance(GetApiRegistryDto, { status: 'true' });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
    expect(dto.status).toBe(true);
  });

  it('should transform status to boolean (false)', async () => {
    dto = plainToInstance(GetApiRegistryDto, { status: 'false' });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
    expect(dto.status).toBe(false);
  });

  it('should validate pagination skip and take as numbers', async () => {
    dto = plainToInstance(GetApiRegistryDto, { page: '10', limit: '20' });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
    expect(dto.page).toBe(10);
    expect(dto.limit).toBe(20);
  });

  it('should fail when page or limit are not numbers', async () => {
    dto = plainToInstance(GetApiRegistryDto, { page: 'abc', limit: 'xyz' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.property === 'page')).toBeTruthy();
    expect(errors.some(e => e.property === 'limit')).toBeTruthy();
  });

  it('should accept optional string fields', async () => {
    dto = plainToInstance(GetApiRegistryDto, {
      clientName: 'Client Test',
      title: 'API Title',
      notifyCondition: 'condition',
      healthStatus: 'good',
      integrationType: 'type',
      triggerId: '123abc',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(5);
  });

  it('should fail when optional string fields are not strings', async () => {
    dto = plainToInstance(GetApiRegistryDto, {
      clientName: 123,
      title: false,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.property === 'clientName')).toBeTruthy();
    expect(errors.some(e => e.property === 'title')).toBeTruthy();
  });
});
