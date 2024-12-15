import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { IsNumberArray } from '../../shared/validators/validatorNumber';

export class GetNotificationsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => (value === 'true' ? true : false))
  isViewed?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  stateIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cityIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @Validate(IsNumberArray)
  clientIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @Validate(IsNumberArray)
  unitIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @Validate(IsNumberArray)
  typeIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @Validate(IsNumberArray)
  subtypeIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dateStart?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dateEnd?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (Number(value)))
  skip?: number;

}
