import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class TruckEntity {
  @ApiProperty({
    type: Number,
    uniqueItems: true,
    description: 'Truck`s identifier',
    nullable: false,
    readOnly: true,
  })
  id: number;

  @ApiProperty({
    type: Number,
    uniqueItems: true,
    description: 'Truck`s id. As it is enumerated in original DB ',
    nullable: true,
  })
  @IsString()
  code: string;

  @ApiProperty({
    type: String,
    description: 'Trucks`s aggregated name. As it is named in original DB',
    nullable: false,
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: Date,
    description: 'Date of creation',
    readOnly: true,
    nullable: false,
  })
  createdAt: Date;
  @ApiProperty({
    type: Date,
    description: 'The last date of being modified',
    readOnly: true,
    nullable: false,
  })
  updatedAt: Date;
}
