import { message, Popconfirm, Image, Button, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { QuizItemModel } from '../../../http/apis/quizs/types';
import {
  delQuiz as delQuizApi,
  endQuizApi,
  getQuizDetail,
  startQuiz,
} from '../../../http/apis/quizs/index';
import { useNavigate } from 'react-router-dom';
import defaultImg from '../../../static/imgs/defaultImg.png';

interface CardProps {
  item: QuizItemModel;
  refreshList: () => void;
}
export const QuizCard: React.FC<CardProps> = (props: CardProps) => {
  const nav = useNavigate();
  const { refreshList, item: QuizItem } = props;
  const { thumbnail, name, owner, id, active } = QuizItem;
  const [quizItemDetail, setQuizItemDetail] = useState<QuizItemModel>(
    {} as QuizItemModel
  );
  const [quizTotalTime, setQuizTotalTime] = useState<number>();
  useEffect(() => {
    getQuizDetail(id).then((res: QuizItemModel) => {
      setQuizItemDetail(res);
      let totalTime = 0;
      res.questions.forEach((item) => {
        totalTime += item.timeLimit;
      });
      setQuizTotalTime(totalTime);
    });
  }, []);
  const delQuiz = async () => {
    const res = await delQuizApi(id);
    if (res) {
      refreshList();
      message.success('Delete successful');
    }
  };
  const editQuiz = () => {
    nav(`/editQuiz/${id}`);
  };
  const startGame = async () => {
    const res = await startQuiz(id);
    if (res) {
      refreshList();
    }
  };

  useEffect(() => {
    console.log('active', active);
    if (active) {
      window.open(`/gameHall/${id}/${active}`, '_blank');
    }
  }, [QuizItem]);
  const endGame = async () => {
    await endQuizApi(id);
    refreshList();
  };

  return (
    <div className="flex flex-row w-full mt-5 border rounded-md min-w-64 border-dark-50">
      <Row className="flex flex-wrap w-full p-4">
        <Col xs={22} md={8}>
          <Image
            alt={name}
            width={280}
            height={200}
            className="object-cover border rounded-md min-w-52 border-cool-gray-50"
            fallback={defaultImg}
            preview={false}
            src={thumbnail}
          />
        </Col>
        <Col xs={24} md={16} className="sm:px-6">
          <div className="flex flex-col justify-between w-full mt-4 ml-0 sm:ml-4 sm:mt-0">
            <div className="flex justify-between">
              <div className="flex flex-col text-left">
                <span className="text-xl font-medium">{name}</span>
                <span className="text-base">{owner}</span>
                <span className="text-base">
                  question count:{quizItemDetail.questions?.length}
                </span>
                <span className="text-base">
                  question total time:{quizTotalTime}
                </span>
              </div>
              <div>
                {active ? 'Gaming' : ''}
                <Button onClick={startGame}>Start Game</Button>
                <Button onClick={endGame}>Game Over</Button>
              </div>
            </div>
            <div className="flex flex-row justify-end">
              <EditOutlined
                onClick={editQuiz}
                key="edit"
                className="text-2xl to-cool-gray-700"
              />
              <Popconfirm
                title="Delete the quiz"
                description="Are you sure to delete this quiz?"
                onConfirm={delQuiz}
                okText="Yes"
                cancelText="No"
                key="delete"
                className="ml-6 text-2xl"
              >
                <DeleteOutlined className="text-pink-600" />
              </Popconfirm>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
