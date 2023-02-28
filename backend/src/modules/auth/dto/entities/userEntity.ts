import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty({
    type: Number,
    uniqueItems: true,
    description: 'User`s identifier',
    nullable: false,
    readOnly: true,
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'User`s Nickname',
    nullable: false,
    minLength: 3,
    maxLength: 10,
  })
  @IsString()
  @Length(3, 10)
  name: string;

  @ApiProperty({
    type: String,
    description: 'User`s email',
    nullable: false,
    uniqueItems: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: 'User`s password',
    nullable: false,
    writeOnly: true,
    minLength: 5,
    maxLength: 8,
  })
  @Length(6, 8)
  password: string;
  @ApiProperty({
    type: Boolean,
    description: 'Is user activated',
    nullable: false,
  })
  activated: boolean;
  @ApiProperty({
    type: String,
    description: 'User`s roles',
    nullable: false,
    isArray: true,
  })
  roles: string[];
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
