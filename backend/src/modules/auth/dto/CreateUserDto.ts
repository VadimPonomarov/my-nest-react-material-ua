import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
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
}
