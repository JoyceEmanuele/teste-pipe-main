import { ApiProperty } from "@nestjs/swagger";

export class ApiUnitRelationEntity {
  @ApiProperty()
  unitName: string;
  @ApiProperty()
  unitId: number;
  constructor(unitName: string, unitId: number) {
    this.unitName = unitName;
    this.unitId = unitId;
  }
}