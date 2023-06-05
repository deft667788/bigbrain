import { QuizItemModel, QuizListModel } from '../../../http/apis/quizs/types';
import { Reducer } from 'redux';
import {
  SAVE_QUIZ_DATA,
  IQuizInfoState,
  QuizActions,
  SAVE_QUIZ_ITEM_DATA
} from './types';

const INITIAL_STATE: IQuizInfoState = {
  quizzes: [] as unknown as QuizListModel,
  currentQuizItemDetail: {} as QuizItemModel
};

const quizReducer: Reducer<IQuizInfoState, QuizActions> = (
  state = INITIAL_STATE,
  action
) => {
  switch (action.type) {
    case SAVE_QUIZ_DATA:
      return {
        ...state,
        quizzes: action.payload
      };
    case SAVE_QUIZ_ITEM_DATA:
      return {
        ...state,
        currentQuizItemDetail: action.payload
      };
    default:
      return state;
  }
};

export default quizReducer;
