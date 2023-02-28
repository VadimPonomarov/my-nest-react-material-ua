import * as bcrypt from 'bcryptjs';
import config from '../../config/configuration';

export const _bcrypt = (password: number | string) => {
  return bcrypt.hashSync('' + password, config().bcrypt.salt);
};

export const _bcryptCompare = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

export const _errorMessage = (message: string) => `Error : ${message}`;
