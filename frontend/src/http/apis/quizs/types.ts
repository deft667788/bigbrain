export interface QuestionItemModal {
  questionId: string;
  questionType: number;
  points: number;
  isoTimeLastQuestionStarted?: string;
  timeLimit: number;
  stem: string;
  img: string;
  answers: string[];
  rightAnswer: number | number[];
}

export interface QuizItemModel {
  id: number;
  createdAt: string;
  name: string;
  thumbnail: string;
  owner: string;
  active: number;
  oldSessions: number[];
  questions: QuestionItemModal[];
}

export interface QuizListModel {
  quizzes: QuizItemModel[];
}

export interface updateQuizParamModal {
  questions?: QuestionItemModal[];
  name?: string;
  thumbnail?: string;
}

export interface AddQuizParamModel {
  name: string;
}

export interface AddQuizResponseModel {
  quizId: string;
}

export interface sessionStatusModal {
  active: boolean;
  answerAvailable: boolean;
  isoTimeLastQuestionStarted: string;
  players: [];
  position: number;
  questions: QuestionItemModal[];
}

export interface sessionStatusResponseModal {
  results: sessionStatusModal;
}

export interface gameResultsAnswerItemModal {
  answerIds: number[];
  answeredAt: string;
  correct: boolean;
  questionStartedAt: string;
}

export interface gameResultsItemModal {
  name: string;
  answers: gameResultsAnswerItemModal[];
}

export interface gameResultsModal {
  results: gameResultsItemModal[];
}
