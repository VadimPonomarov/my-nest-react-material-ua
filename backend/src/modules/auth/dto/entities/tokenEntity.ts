import { JwtEnum } from '../../../../common/constants';
import { ApiProperty } from '@nestjs/swagger';

export class TokenEntity {
  @ApiProperty({
    type: Number,
    uniqueItems: true,
    description: 'Token`s identifier',
    nullable: false,
    readOnly: true,
  })
  id: number;
  @ApiProperty({
    type: JwtEnum,
    description: 'Type of token [`ACCESS`, `REFRESH`, `ACTIVATION`, ...]',
    nullable: false,
  })
  type: JwtEnum;
  @ApiProperty({
    type: String,
    description: 'JWT token',
    nullable: false,
    uniqueItems: true,
  })
  token: string;
  @ApiProperty({
    type: Date,
    description: 'Date of creation',
    readOnly: true,
    nullable: false,
  })
  createdAt: Date;
}
