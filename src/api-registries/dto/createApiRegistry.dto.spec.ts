import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateApiRegistryDto } from './createApiRegistry.dto';
import * as factories from '../../test/factories/apiRegistry';

describe('CreateApiRegistryDto', () => {
  let validDto: CreateApiRegistryDto;

  beforeEach(() => {
    validDto = factories.generateApiRegistryEntity();
  });

  const validateDto = async (dtoObject: Partial<CreateApiRegistryDto>) => {
    const dtoInstance = plainToInstance(CreateApiRegistryDto, dtoObject);
    const errors = await validate(dtoInstance);
    return errors;
  };

  it('should validate a valid DTO', async () => {
    const errors = await validateDto(validDto);
    expect(errors.length).toBe(0);
  });

  it('should fail when clientId is missing or not an integer', async () => {
    const invalidDto = { ...validDto, clientId: 'abc' as any };
    const errors = await validateDto(invalidDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isInt).toBeDefined();
  });

  it('should fail when clientName is missing', async () => {
    const invalidDto = { ...validDto, clientName: '' };
    const errors = await validateDto(invalidDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
  });

  it('should fail when title is missing', async () => {
    const invalidDto = { ...validDto, title: '' };
    const errors = await validateDto(invalidDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
  });

  it('should fail when notifyCondition is invalid', async () => {
    const invalidDto = { ...validDto, notifyCondition: 'INVALID_ENUM' as any };
    const errors = await validateDto(invalidDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isEnum).toBeDefined();
  });

  it('should fail when healthStatus is invalid', async () => {
    const invalidDto = { ...validDto, healthStatus: 'INVALID_ENUM' as any };
    const errors = await validateDto(invalidDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isEnum).toBeDefined();
  });

  it('should fail when integrationType is invalid', async () => {
    const invalidDto = { ...validDto, integrationType: 'INVALID_ENUM' as any };
    const errors = await validateDto(invalidDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isEnum).toBeDefined();
  });

  it('should fail when triggerId is missing', async () => {
    const invalidDto = { ...validDto, triggerId: '' };
    const errors = await validateDto(invalidDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
  });

  it('should default status to true if not provided', async () => {
    const dtoWithoutStatus = { ...validDto, status: undefined };
    const dtoInstance = plainToInstance(CreateApiRegistryDto, dtoWithoutStatus);
    expect(dtoInstance.status).toBe(true);
  });

  it('should transform status string "true" to boolean true', async () => {
    const dtoWithStatusTrue = { ...validDto, status: 'true' as any };
    const dtoInstance = plainToInstance(CreateApiRegistryDto, dtoWithStatusTrue);
    expect(dtoInstance.status).toBe(true);
  });

  it('should transform status string "false" to boolean false', async () => {
    const dtoWithStatusFalse = { ...validDto, status: 'false' as any };
    const dtoInstance = plainToInstance(CreateApiRegistryDto, dtoWithStatusFalse);
    expect(dtoInstance.status).toBe(false);
  });
});
