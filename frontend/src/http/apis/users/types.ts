export interface LoginParam {
  email: string;
  password: string;
}

export interface RegisterParam {
  email: string;
  password: string;
  name: string;
}
export interface RegisterResponse {
  token: string;
}

export interface LoginResponse {
  token: string;
}
