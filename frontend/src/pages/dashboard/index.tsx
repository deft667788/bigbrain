import { QuizItemModel, QuizListModel } from '../..//http/apis/quizs/types';
import { Button, Row, Spin } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { getQuizList as getQuizListApi } from '../../http/apis/quizs/index';
import { QuizCard } from './components/QuizCard';
import { AddQuizModal } from './components/AddQuiz';
import Header from '../components/Header';

const Dashboard = function () {
  const [loading, setLoading] = useState(false);
  const [quizList, setQuizList] = useState<Array<QuizItemModel>>(
    [] as QuizItemModel[]
  );

  const getQuizList = useCallback(async () => {
    setLoading(true);
    const res: QuizListModel = await getQuizListApi();
    setQuizList(res.quizzes);
    setLoading(false);
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const addQuiz = () => {
    showModal();
  };
  useEffect(() => {
    getQuizList();
  }, [getQuizList]);
  return (
    <>
      <Header></Header>
      <div className="p-10">
        <Spin spinning={loading} size="large"></Spin>
        <Row justify="end">
          <Button onClick={addQuiz}>add a quiz</Button>
        </Row>
        <Row gutter={16} justify="space-around">
          {quizList.map((item) => {
            return (
              <div key={item.id} className="w-full">
                <QuizCard item={item} refreshList={getQuizList}></QuizCard>
              </div>
            );
          })}
        </Row>

        <AddQuizModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        ></AddQuizModal>
      </div>
    </>
  );
};
export default Dashboard;
