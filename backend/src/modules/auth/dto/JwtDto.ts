import { JwtEnum } from '../../../common/constants';

export class JwtDto {
  type: JwtEnum;
  token: string;
}
