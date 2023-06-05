import http from '../../index';
import {
  LoginParam,
  RegisterParam,
  RegisterResponse,
  LoginResponse
} from './types';

/**
 * User Account Registration
 *
 * @export
 * @param {RegisterParam} params
 * @return {*}  {Promise<RegisterResponse>}
 */
export const register = (params: RegisterParam): Promise<RegisterResponse> => {
  return http.post('/admin/auth/register', params);
};

/**
 * User account Login
 *
 * @export
 * @param {LoginParam} params
 * @return {*}  {Promise<LoginResponse>}
 */
export const login = (params: LoginParam): Promise<LoginResponse> => {
  return http.post('/admin/auth/login', params);
};
/**
 * Logout
 *
 * @export
 * @param {LoginParam}
 * @return {*}  {Promise<>}
 */
export const logout = (): Promise<object> => {
  return http.post('/admin/auth/logout');
};
