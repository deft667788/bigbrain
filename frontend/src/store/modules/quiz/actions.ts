import { QuizListModel, QuizItemModel } from '../../../http/apis/quizs/types';
import {
  ISaveQuizDataAction,
  ISaveCurrQuizDetailAction,
  SAVE_QUIZ_DATA,
  SAVE_QUIZ_ITEM_DATA
} from './types';

export const saveQuizData = (data: QuizListModel): ISaveQuizDataAction => {
  return {
    type: SAVE_QUIZ_DATA,
    payload: data
  };
};
export const saveCurrQuizItemDetailData = (
  data: QuizItemModel
): ISaveCurrQuizDetailAction => {
  return {
    type: SAVE_QUIZ_ITEM_DATA,
    payload: data
  };
};
