import { LoginParam } from '../../../http/apis/users/types';

export interface IUserInfoState {
  loginData: LoginParam;
  token: string;
}
