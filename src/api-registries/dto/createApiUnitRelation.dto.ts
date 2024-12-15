import { ApiProperty } from "@nestjs/swagger";
import { Transform} from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class CreateApiUnitRelationDto {
    @ApiProperty({
      description: 'Nome da unidade'
    })
    @IsNotEmpty()
    @IsString()
    unitName: string;

    @ApiProperty({
      description: 'ID da unidade relacionada',
    })
    @IsNotEmpty()
    @IsInt()
    @Transform(({ value }) => Number(value))
    unitId: number;

    @ApiProperty({
      description: 'Data de criação do registro',
      readOnly: true,
      type: String,
      format: 'date-time',
    })
    @IsOptional()
    createdAt?: Date;
  
    @ApiProperty({
      description: 'Data de última atualização do registro',
      readOnly: true,
      type: String,
      format: 'date-time',
    })
    @IsOptional()
    updatedAt?: Date;
}