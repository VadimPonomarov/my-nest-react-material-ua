import { RoleEnum } from '../../../../common/constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Length } from 'class-validator';

export class RoleEntity {
  @ApiProperty({
    type: Number,
    description: 'Role`s identifier',
    nullable: false,
  })
  id: number;

  @ApiProperty({
    type: RoleEnum,
    description: 'Role`s name',
    nullable: false,
    required: true,
  })
  name: RoleEnum;

  @ApiProperty({
    type: Number,
    description: 'UserId reference',
    required: true,
  })
  @IsNumber()
  userId: number;
}
