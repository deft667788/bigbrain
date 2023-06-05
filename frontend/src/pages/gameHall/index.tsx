import React, { useEffect, useState, useRef } from 'react';
import {
  Button,
  Image,
  Row,
  Col,
  message,
  Divider,
  Carousel,
  Modal,
} from 'antd';
import { CopyOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import {
  advanceQuiz,
  getQuizSessionStatusApi,
  endQuizApi,
} from '../../http/apis/quizs';
import {
  sessionStatusModal
} from '../../http/apis/quizs/types';
import copy from 'copy-to-clipboard';
import { CarouselRef } from 'antd/es/carousel';
import { getRandomColor } from '../../utils';
import dayjs from 'dayjs';
import Header from '../components/Header';

const GameHall = () => {
  const sliderRef = useRef({} as CarouselRef);
  const { sessionId, quizId } = useParams();
  const [currStatus, setCurrStatus] = useState<sessionStatusModal>({
    active: true,
  } as sessionStatusModal);
  let getStatusTimer: NodeJS.Timer;

  const [timeCount, setTimeCount] = useState<number>();

  const countDown = (count: number, start?: string) => {
    // console.log('start', start);
    let Timer: NodeJS.Timer;
    if (count) {
      Timer = setInterval(() => {
        const leftTimeCount = count - dayjs().diff(dayjs(start), 'second');
        console.log('leftTimeCount', leftTimeCount);
        setTimeCount(leftTimeCount);
        if (leftTimeCount <= 0) {
          clearInterval(Timer);
          showModal();
        }
      }, 1000);
    }
  };
  const getSessionStatus = () => {
    getStatusTimer = setInterval(async () => {
      getQuizSessionStatusApi(Number(sessionId)).then((res) => {
        const { active, position, questions } = res.results;
        setCurrStatus(res.results);
        if (!active) {
          clearInterval(getStatusTimer);
          console.log(getStatusTimer);
          return;
        }
        if (position > -1) {
          console.log('position', position, questions[position]?.timeLimit);
          console.log('questions', questions.length);
          clearInterval(getStatusTimer);
          if (position + 1 === questions.length) {
            setIsQuestionOver(true);
          }
          sliderGoToPage(position + 1);
          countDown(
            questions[position]?.timeLimit || 0,
            res.results?.isoTimeLastQuestionStarted
          );
        }
        if (position + 1 === questions?.length) {
          console.log('Game Over');
        }
      });
    }, 2000);
  };

  useEffect(() => {
    getSessionStatus();
  }, []);

  const { players, questions } = currStatus;
  const navigate = useNavigate();

  // Let's go to the next problem
  const sliderNextQuestionPage = () => {
    quizId && advanceQuiz(Number(quizId));
    sliderRef.current.next();
  };

  // Entering a specified page
  const sliderGoToPage = (position: number) => {
    setTimeout(() => {
      sliderRef.current.goTo(position);
    }, 500);
  };

  const copyLink = () => {
    const playerLinkUrl = window.location.host + `/joinPlay/${sessionId}`;
    // console.log(playerLinkUrl);
    if (copy(playerLinkUrl)) {
      message.success('Copy successfully, please open a new TAB to the game');
    } else {
      message.error('Replication failure');
    }
  };
  const copySessionId = () => {
    if (sessionId && copy(sessionId)) {
      message.success('Copy success!');
    } else {
      message.error('Replication failure!');
    }
  };
  const startGame = () => {
    if (!players.length) {
      message.error('No player has joined the game yet');
      return;
    }
    sliderNextQuestionPage();
  };
  const quitGame = () => {
    navigate('/dashboard');
  };
  const gameOver = () => {
    return (
      <div className="w-full">
        <Row className="flex justify-end">
          <Button onClick={quitGame}>Quit the game</Button>
        </Row>
        <Row className="mb-4 text-center">
          <Col span={24}>
            <span className="text-xl text-white ">The game is over, please return home</span>
          </Col>
        </Row>
      </div>
    );
  };

  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };
  const nextQuestion = () => {
    if (isQuestionOver) {
      console.log('Game Over');
      quizId &&
        endQuizApi(Number(quizId)).then(() => {
          navigate(`/gameResults/${quizId}/${sessionId}`);
        });
    } else {
      hideModal();
      sliderNextQuestionPage();
      getSessionStatus();
      // console.log('next question');
    }
  };
  const [isQuestionOver, setIsQuestionOver] = useState(
    currStatus.position + 1 === currStatus.questions?.length
  );
  return (
    <div className="w-full min-h-full bg-blue-900 bg-opacity-50 ">
      <Header></Header>
      {/* <img src="../../static/imgs/bg.jpg" alt="bg" className="w-full" /> */}

      <Carousel
        dots={false}
        ref={sliderRef}
        infinite={false}
        className="w-full p-6 "
      >
        <div className="w-full ">
          {!currStatus.active ? gameOver() : ''}
          <Row
            style={{ display: !currStatus.active ? 'none' : 'flex' }}
            className="flex! flex-row justify-around  w-full h-full"
            gutter={12}
          >
            <Col
              xs={22}
              md={10}
              className="flex flex-col justify-center p-6 text-3xl bg-black bg-opacity-50 border-solid rounded-2xl"
            >
              <div className="mb-2 text-base text-center text-white">
                Copy the link and go to the new TAB to join the game
              </div>
              <div className="flex justify-between p-4 mb-2 bg-white sm:mb-10 rounded-xl">
                <span>{window.location.host}</span>{' '}
                <CopyOutlined onClick={copyLink} />
              </div>
              <div className="mb-2 text-base text-center text-white">
                Copy sessionId and join the game
              </div>
              <div className="flex justify-between p-4 bg-white rounded-xl">
                <span>{sessionId}</span>{' '}
                <CopyOutlined onClick={copySessionId} />
              </div>
            </Col>
            <Col
              xs={22}
              md={12}
              className="flex flex-col justify-between p-6 pl-8 pr-8 mt-4 bg-black bg-opacity-50 border-solid rounded-2xl sm:mt-0"
            >
              <Row className="flex justify-center w-full text-sm text-white sm:text-2xl">
                <span className="">Waiting for players to join</span>
                <Divider plain className="bg-white"></Divider>
                <div className="flex items-center justify-center w-full p-2 text-3xl text-white bg-gray-600 bg-opacity-50 sm:p-6 rounded-xl">
                  <TeamOutlined className="mr-2" />
                  <span>{players?.length || 0}</span>
                </div>
              </Row>
              <Row className="flex flex-row flex-wrap justify-center h-12 mt-2 text-2xl sm:mt-10 sm:h-64">
                {players?.map((item, index) => {
                  return (
                    <div
                      className="h-12 p-2 mr-4 text-center text-white rounded-md bg-slate-800"
                      key={item + index}
                    >
                      {item}
                    </div>
                  );
                })}
              </Row>
              <Button
                className="w-full h-12 mt-10 bg-blue-600"
                type="primary"
                onClick={startGame}
                disabled={!currStatus.active}
              >
                Start
              </Button>
            </Col>
          </Row>
        </div>
        {questions?.map((item, index) => {
          return (
            <div key={item.questionId} className="w-full h-full">
              <Row className="w-full text-white">
                <Row className="flex flex-row items-center justify-around w-full mb-4">
                  <span className="text-xl">the{index + 1}question</span>
                  <div className="flex items-center justify-center w-20 h-6 p-6 bg-gray-800 rounded-xl">
                    <span>{timeCount}seconds</span>
                  </div>
                  <div className="flex items-center justify-center w-20 h-6 p-6 bg-gray-800 rounded-xl">
                    <span>{item.points}points</span>
                  </div>
                </Row>
                <Row className="flex items-center justify-start w-full p-4 sm:p-8 h-44 sm:h-80 bg-slate-500 bg-opacity-80 rounded-2xl">
                  <Col span={8}>
                    <Image
                      alt="question img"
                      preview={false}
                      className="w-48"
                      src={item.img}
                    ></Image>
                  </Col>
                  <Col className="ml-6">
                    <span className="text-4xl font-bold">{item.stem}</span>
                  </Col>
                </Row>
                <Row
                  className="flex flex-row justify-between w-full p-4 mt-2 sm:mt-10"
                  gutter={12}
                >
                  {/* {item.questionType ? (
                    Checkbox
                  ): ()} */}
                  {item?.answers.map((answerItem, index) => {
                    return (
                      <Button
                        key={answerItem + index}
                        className="flex items-center justify-start w-full h-16 pl-2 mt-8 text-lg font-bold text-white sm:w-2/5 sm:pl-10 sm:h-28 rounded-xl sm:text-4xl"
                        style={{ backgroundColor: getRandomColor(index) }}
                      >
                        <div>{answerItem}</div>
                      </Button>
                    );
                  })}
                </Row>
              </Row>
            </div>
          );
        })}
      </Carousel>
      <Modal
        maskClosable={false}
        closable={false}
        footer={false}
        title="It's time to answer"
        open={open}
      >
        <div>{isQuestionOver ? 'Game over' : null}</div>
        <Button onClick={nextQuestion}>
          {isQuestionOver ? 'Viewing game results' : 'Next'}
        </Button>
      </Modal>
    </div>
  );
};
export default GameHall;
