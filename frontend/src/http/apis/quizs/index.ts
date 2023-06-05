import http from '../../index';
import {
  AddQuizParamModel,
  AddQuizResponseModel,
  gameResultsModal,
  QuizItemModel,
  QuizListModel,
  sessionStatusResponseModal,
  updateQuizParamModal
} from './types';

/**
 * get quiz
 *
 * @export
 * @return {*}  {Promise<QuizListModel>}
 */
export const getQuizList = (): Promise<QuizListModel> => {
  return http.get('/admin/quiz');
};
/**
 * create quiz
 *
 * @export
 * @return {*}  {Promise<QuizListModel>}
 */
export const addQuiz = (
  addQuizParam: AddQuizParamModel
): Promise<AddQuizResponseModel> => {
  return http.post('/admin/quiz/new', addQuizParam);
};

/**
 * delete quiz
 */
export const delQuiz = (quizId: number): Promise<object> => {
  return http.delete(`/admin/quiz/${quizId}`);
};

/**
 * acquire the details of quiz
 *
 * @export
 * @return {*}  {Promise<QuizItemModal>}
 */
export const getQuizDetail = (quizId: number): Promise<QuizItemModel> => {
  return http.get(`/admin/quiz/${quizId}`);
};

/**
 * update the details of quiz
 */
export const updateQuiz = (
  quizId: string,
  updateQuizParam: updateQuizParamModal
): Promise<object> => {
  return http.put(`/admin/quiz/${quizId}`, updateQuizParam);
};

/**
 * start quiz
 */
export const startQuiz = (quizId: number): Promise<object> => {
  return http.post(`/admin/quiz/${quizId}/start`);
};
/**
 * advance;
  quiz
 */
export const advanceQuiz = (quizId: number): Promise<object> => {
  return http.post(`/admin/quiz/${quizId}/advance`);
};
/**
 * end quiz
 */
export const endQuizApi = (quizId: number): Promise<object> => {
  return http.post(`/admin/quiz/${quizId}/end`);
};

/**
 * get Quiz Session
 */
export const getQuizSessionStatusApi = (
  sessionid: number
): Promise<sessionStatusResponseModal> => {
  return http.get(`/admin/session/${sessionid}/status`);
};

/**
 * get Quiz results
 */
export const getQuizResultsApi = (
  sessionid: number
): Promise<gameResultsModal> => {
  return http.get(`/admin/session/${sessionid}/results
`);
};
