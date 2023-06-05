import { Action, ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '..';
import { QuizItemModel, QuizListModel } from '../../../http/apis/quizs/types';

export interface IQuizInfoState {
  quizzes: QuizListModel;
  currentQuizItemDetail: QuizItemModel;
}

export const SAVE_QUIZ_DATA = 'SAVE_QUIZ_DATA';
export const SAVE_QUIZ_ITEM_DATA = 'SAVE_QUIZ_ITEM_DATA';

export interface ISaveQuizDataAction extends Action<typeof SAVE_QUIZ_DATA> {
  payload: QuizListModel;
}
export interface ISaveCurrQuizDetailAction
  extends Action<typeof SAVE_QUIZ_ITEM_DATA> {
  payload: QuizItemModel;
}

export type AsyncSetQuizAction = ActionCreator<
  ThunkAction<
    Promise<ISaveQuizDataAction>,
    RootState,
    null,
    ISaveQuizDataAction
  >
>;
export type AsyncSetCurrQuizDetailAction = ActionCreator<
  ThunkAction<
    Promise<ISaveCurrQuizDetailAction>,
    RootState,
    null,
    ISaveCurrQuizDetailAction
  >
>;

export type QuizActions = ISaveQuizDataAction | ISaveCurrQuizDetailAction;
