import { ApiProperty, PartialType } from '@nestjs/swagger';
import { RoleEntity } from './entities';
import { IsNumber } from 'class-validator';

export class CreateRoleDto extends PartialType(RoleEntity) {
  @ApiProperty({
    type: Number,
    description: 'Role identifier',
    nullable: false,
    writeOnly: true,
  })
  id: number;

  @ApiProperty({
    type: Number,
    description: 'User iD reference',
    required: true,
    writeOnly: true,
  })
  @IsNumber()
  userId: number;
}
