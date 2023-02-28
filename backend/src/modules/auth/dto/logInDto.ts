import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class LogInDto {
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
