import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Col,
  Input,
  message,
  Modal,
  Result,
  Row,
  Image,
  Checkbox,
  Radio,
  RadioChangeEvent,
} from 'antd';
import { useParams } from 'react-router-dom';
import {
  JoinGameResponseModal,
  PlayerQuestionResModal,
  PlayerStatusResponseModal,
} from '../../http/apis/player/types';
import {
  joinGameApi,
  getPlayerStatusApi,
  getPlayerQuestionsApi,
  postPlayerAnswerApi,
  getCorrectAnswerApi,
} from '../../http/apis/player/index';
import { QuestionItemModal } from '../../http/apis/quizs/types';
import { getRandomColor } from '../../utils';
import dayjs from 'dayjs';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
// import UnJoin from './components/JoinGame';

const JoinPlay = () => {
  const { sessionId } = useParams();
  const [playerName, setPlayerName] = useState<string>('');
  const [playerStatus, setPlayerStatus] = useState<PlayerStatusResponseModal>(
    {} as PlayerStatusResponseModal
  );

  // const [getStatusTimer, setStatusTimer] = useState<NodeJS.Timer>();
  const [playerQuestion, setPlayerQuestion] = useState<QuestionItemModal>(
    {} as QuestionItemModal
  );

  const [playerId, setPlayerId] = useState<number>(
    Number(localStorage.getItem('playerId') || '')
  );
  const [open, setOpen] = useState(false);
  const [timeCount, setTimeCount] = useState<number>();

  const countDown = (count: number, start?: string) => {
    let Timer: NodeJS.Timer;
    if (count) {
      Timer = setInterval(() => {
        // console.log(count - dayjs().diff(dayjs(start)), 'second');
        const leftTimeCount = count - dayjs().diff(dayjs(start), 'second');
        if (leftTimeCount <= 0) {
          clearInterval(Timer);
          getPlayerStatus();
          getCorrectAnswer();
        } else {
          setTimeCount(leftTimeCount);
        }
      }, 1000);
    }
  };

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };
  let getStatusTimer: NodeJS.Timer;
  const getPlayerStatus = useCallback(async () => {
    getStatusTimer = setInterval(async () => {
      getPlayerStatusApi(playerId).then((res: PlayerStatusResponseModal) => {
        setPlayerStatus(res);
        // console.log('res', res);
        if (!res) {
          // console.log('getStatusTimer', getStatusTimer);
          clearInterval(getStatusTimer);
        }
        if (res.started) {
          clearInterval(getStatusTimer);
          getPlayerQuestion();
        }
      });
    }, 2000);
  }, [playerId]);

  const getPlayerQuestion = useCallback(async () => {
    getPlayerQuestionsApi(playerId).then((res: PlayerQuestionResModal) => {
      setPlayerQuestion(res.question);
      afterQuestionGet(res);
    });
  }, [playerId]);

  const afterQuestionGet = (res: PlayerQuestionResModal) => {
    const lastQuestionId = localStorage.getItem('currQuestionId');
    if (res.question.questionId !== lastQuestionId) {
      // Note title Update
      hideModal();
      localStorage.setItem('currQuestionId', res.question.questionId);

      localStorage.removeItem('currAnswers');
    }
    countDown(res.question.timeLimit, res.question.isoTimeLastQuestionStarted);
  };

  useEffect(() => {
    // If the payerId is updated, the player has joined the game, and the status is obtained
    const storageSessionId = localStorage.getItem('sessionId');
    if (sessionId === storageSessionId && playerId) {
      getPlayerStatus();
    } else {
      sessionId && localStorage.setItem('sessionId', sessionId);
      setPlayerId(0);
      localStorage.removeItem('playerId');
      localStorage.removeItem('playerName');
    }
  }, [playerId]);

  const handleJoinGame = async () => {
    if (!playerName) {
      message.error('Please enter a nickname');
      return;
    }
    if (sessionId) {
      try {
        const res: JoinGameResponseModal = await joinGameApi(
          sessionId,
          playerName
        );
        setPlayerId(res.playerId);
        localStorage.setItem('playerId', JSON.stringify(res.playerId));
        localStorage.setItem('playerName', JSON.stringify(playerName));
      } catch (error) {
        message.error('Failed to join the game');
      }
    }
  };
  const unJoin = () => {
    return (
      <div className="p-6 opacity-50 w-80 bg-slate-700 rounded-xl">
        <Input
          placeholder="Give me a name"
          value={playerName}
          onChange={(e) => {
            setPlayerName(e.target.value);
          }}
          className="w-full p-4 text-xl text-black"
        ></Input>
        <Button
          size="large"
          type="primary"
          className="w-full mt-6 bg-blue-600"
          onClick={handleJoinGame}
        >
          Join the game
        </Button>
      </div>
    );
  };
  const joined = () => {
    return (
      <div className="p-6 opacity-50 w-80 bg-slate-900 rounded-xl">
        <span>{JSON.stringify(localStorage.removeItem('playerName'))}</span>
        <span className="text-xl font-extrabold text-white">
          You have joined the game, please wait for the game to start!
        </span>
      </div>
    );
  };
  const [myAnswers, setMyAnswers] = useState<number[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<number | number[]>([]);
  const [answerStatus, setAnswerStatus] = useState<boolean>(false);

  const postPlayerAnswer = (answers: number[]) => {
    if (playerId) {
      postPlayerAnswerApi(playerId, answers);
    }
  };
  const getCorrectAnswer = () => {
    playerId &&
      getCorrectAnswerApi(playerId).then((res) => {
        if (!res) {
          // clearInterval(getStatusTimer);
          return;
        }
        const answerStorage = localStorage.getItem('currAnswers');
        setCorrectAnswers(res.answerIds);
        if (typeof res.answerIds === 'object') {
          // const cu = myMulAnswers ? myMulAnswers : answerStorage;
          if (answerStorage === JSON.stringify(res.answerIds)) {
            setAnswerStatus(true);
          } else {
            setAnswerStatus(false);
          }
        } else {
          // console.log(answerStorage);
          // console.log([res.answerIds]);
          if (answerStorage === JSON.stringify([res.answerIds])) {
            setAnswerStatus(true);
          } else {
            setAnswerStatus(false);
          }
        }
        showModal();
      });
  };

  const onCheckboxChange = (checkedValues: CheckboxValueType[]) => {
    console.log('checkedValues', checkedValues);
    const currAnswer = JSON.stringify(checkedValues.sort());
    postPlayerAnswer(JSON.parse(currAnswer));
    localStorage.setItem('currAnswers', currAnswer);
    setMyAnswers(JSON.parse(currAnswer));
  };
  const checkboxWrap = () => {
    return (
      <Checkbox.Group value={myAnswers} onChange={onCheckboxChange}>
        <Row className="flex justify-around">
          {playerQuestion?.answers?.map((item, index) => {
            return (
              <Col span={11} key={item + index}>
                <Checkbox
                  value={index}
                  className="box-border flex items-center justify-start w-full pl-2 mt-8 sm:pl-10 h-28 rounded-xl"
                  style={{
                    backgroundColor: getRandomColor(index),
                    border: myAnswers.includes(index)
                      ? '2px solid white'
                      : 'none',
                  }}
                >
                  <span className="text-lg font-bold text-white sm:text-4xl">
                    {item}
                  </span>
                </Checkbox>
              </Col>
            );
          })}
        </Row>
      </Checkbox.Group>
    );
  };
  const onChange = (e: RadioChangeEvent) => {
    // console.log('radio checked', [e.target.value]);
    setMyAnswers([e.target.value]);
    localStorage.setItem('currAnswers', JSON.stringify([e.target.value]));
    postPlayerAnswer([e.target.value]);
  };
  const radioWrap = () => {
    return (
      <Radio.Group
        value={myAnswers}
        onChange={onChange}
        className="w-full"
        buttonStyle="solid"
      >
        <Row className="flex justify-around">
          {playerQuestion?.answers?.map((item, index) => {
            return (
              <Col span={11} key={item + index}>
                <Radio.Button
                  value={index}
                  className="box-border flex items-center justify-start w-full pl-2 mt-8 sm:pl-10 h-28 rounded-xl"
                  style={{
                    backgroundColor: getRandomColor(index),
                    border:
                      Number(myAnswers.join('')) === index
                        ? '2px solid white'
                        : 'none',
                  }}
                >
                  <span className="text-lg font-bold text-white sm:text-4xl">
                    {item}
                  </span>
                </Radio.Button>
              </Col>
            );
          })}
        </Row>
      </Radio.Group>
    );
  };
  const Playing = () => {
    return (
      <div className="w-full h-full">
        <Row className="w-full text-white">
          <Row className="flex flex-row items-center justify-end w-full mb-4">
            <div className="flex items-center justify-center w-20 h-6 p-6 bg-gray-800 rounded-xl">
              <span>{timeCount}seconds</span>
            </div>
            <div className="flex items-center justify-center w-20 h-6 p-6 ml-4 bg-gray-800 rounded-xl">
              <span>{playerQuestion.points}points</span>
            </div>
          </Row>
          <Row className="flex items-center justify-center w-full h-80 sm:h-50 bg-slate-500 bg-opacity-80 rounded-2xl">
            <Col span={playerQuestion.img ? 8 : 0}>
              <Image
                alt="question img"
                preview={false}
                src={playerQuestion.img}
              ></Image>
            </Col>
            <Col className="ml-6">
              <span className="text-4xl font-bold">{playerQuestion.stem}</span>
            </Col>
          </Row>
          <Row
            className="flex flex-row justify-between w-full p-4 mt-2 sm:mt-10"
            gutter={12}
          >
            {playerQuestion?.questionType ? checkboxWrap() : radioWrap()}
          </Row>
        </Row>
      </div>
    );
  };
  const ShowAnswers = (answers: number | number[]) => {
    if (!playerQuestion?.answers) return;
    // console.log(answers);

    if (typeof answers === 'object') {
      return (
        <div className="">
          {answers.map((item, index) => {
            return (
              <span key={item + index}>{playerQuestion?.answers[item]} , </span>
            );
          })}
        </div>
      );
    } else {
      return <span>{playerQuestion?.answers[answers]}</span>;
    }
  };
  const answerStorage = localStorage.getItem('currAnswers');
  return (
    <div className="flex items-center justify-center w-full min-h-full p-6 bg-blue-900 bg-opacity-50 ">
      {/* {(playerStatus?.started, '---' + playerId)} */}
      {playerStatus?.started ? Playing() : playerId ? joined() : unJoin()}
      <Modal
        maskClosable={false}
        closable={false}
        footer={false}
        title="Time Out"
        open={open}
      >
        <div className="h-60">
          <Result
            status={answerStatus ? 'success' : 'error'}
            title={answerStatus ? 'You have chosen the right answer!' : 'You have chosen the wrong answer!'}
            extra={
              <div>
                <div className="flex justify-center w-full">
                  <div>Correct Answer: </div>
                  {ShowAnswers(correctAnswers)}
                </div>
                <div className="flex justify-center w-full">
                  <div>Your Answer: </div>
                  {ShowAnswers(answerStorage ? JSON.parse(answerStorage) : '')}
                </div>
              </div>
            }
          />
        </div>
      </Modal>
    </div>
  );
};
export default JoinPlay;
