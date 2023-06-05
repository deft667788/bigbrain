import http from '../../index';
import {
  JoinGameResponseModal,
  PlayerCorrectAnswerResModal,
  PlayerQuestionResModal,
  PlayerStatusResponseModal
} from './types';

/**
 * join game
 *
 * @export
 * @return {*}  {Promise<>}
 */
export const joinGameApi = (
  sessionid: string,
  name: string
): Promise<JoinGameResponseModal> => {
  return http.post(`/play/join/${sessionid}`, { name });
};

/**
 * search the condition of player
 *
 * @export
 * @return {*}  {Promise<PlayerStatusResponseModal}
 */
export const getPlayerStatusApi = (
  playerId: number
): Promise<PlayerStatusResponseModal> => {
  return http.get(`/play/${playerId}/status`);
};

/**
 * search player questions
 *
 * @export
 * @return {*}  {Promise<QuestionItemModal}
 */
export const getPlayerQuestionsApi = (
  playerId: number
): Promise<PlayerQuestionResModal> => {
  return http.get(`/play/${playerId}/question`);
};

/**
 * Get the player's correct answer
 *
 * @export
 * @return {*}  {Promise<PlayerCorrectAnswerResModal>}
 */
export const getCorrectAnswerApi = (
  playerId: number
): Promise<PlayerCorrectAnswerResModal> => {
  return http.get(`/play/${playerId}/answer`);
};
/**
 * Players submit answers
 *
 * @export
 * @return {*}  {Promise<QuestionItemModal}
 */
export const postPlayerAnswerApi = (
  playerId: number,
  answerIds: number[]
): Promise<object> => {
  return http.put(`/play/${playerId}/answer`, { answerIds });
};

/**
 * Players get results
 *
 * @export
 * @return {*}  {Promise<any}
 */
export const getPlayerResultsApi = (playerId: number): Promise<object> => {
  return http.get(`/play/${playerId}/results`);
};
