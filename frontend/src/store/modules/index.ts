import { combineReducers } from 'redux';
import userReducer from './user/index';
import quizReducer from './quiz/index';

const rootReducer = combineReducers({
  userReducer,
  quizReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
