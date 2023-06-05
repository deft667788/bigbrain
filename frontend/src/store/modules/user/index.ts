import { Reducer } from 'redux';
import { IUserInfoState } from './types';

const INITIAL_STATE: IUserInfoState = {
  loginData: {
    email: '',
    password: ''
  },
  token: ''
};

const userReducer: Reducer<IUserInfoState> = (
  state = INITIAL_STATE,
  action
) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default userReducer;
