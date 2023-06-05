import { QuestionItemModal } from '../quizs/types';

export interface JoinGameResponseModal {
  playerId: number;
}
export interface PlayerStatusResponseModal {
  started: boolean;
}
export interface PlayerQuestionResModal {
  question: QuestionItemModal;
}
export interface PlayerCorrectAnswerResModal {
  answerIds: number | number[];
}
