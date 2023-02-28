import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTruckDto {
  @ApiProperty({
    type: String,
    description: 'Trucks`s aggregated name. As it is named in original DB',
    nullable: false,
  })
  @IsString()
  name: string;
}
