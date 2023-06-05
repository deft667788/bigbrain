import { Row, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getQuizResultsApi,
  getQuizDetail as getQuizDetailApi,
} from '../../http/apis/quizs';
import {
  gameResultsItemModal,
  QuizItemModel,
} from '../../http/apis/quizs/types';
import ReactEcharts from 'echarts-for-react';
import { columns } from './data';
import dayjs from 'dayjs';
import Header from '../components/Header';

interface tableDataModal {
  key: number;
  index: number;
  name: string;
  points: string | number | undefined;
  time: number;
}
interface answerDataModal {
  questionNum: string;
  correctAverage: number;
}
interface answerTimeDataModal {
  questionNum: string;
  timeAverage: number;
}

const GameResults: React.FC = () => {
  const { sessionId, quizId } = useParams();
  const [gameResults, setGameResults] = useState<gameResultsItemModal[]>([]);
  // const [currQuizDetail, setCurrQuizDetail] = useState<QuizItemModel>(
  //   {} as QuizItemModel
  // );
  const [currQuizPointsList, setCurrQuizPointsList] = useState<number[]>([]);
  const [tableData, setTableData] = useState<tableDataModal[]>([]);
  const [answersChartsData, setAnswersChartsData] = useState<answerDataModal[]>(
    []
  );
  const [answersTimeChartsData, setAnswersTimeChartsData] = useState<
    answerTimeDataModal[]
  >([]);
  const getGameResult = () => {
    getQuizResultsApi(Number(sessionId)).then((res) => {
      setGameResults(res.results);
    });
  };
  const getQuizDetailAction = async () => {
    if (quizId) {
      const curr: QuizItemModel = await getQuizDetailApi(Number(quizId));
      // setCurrQuizDetail(curr);
      setCurrQuizPointsList(curr.questions.map((item) => item.points));
    }
  };

  const diffTime = (time1: string | undefined, time2: string | undefined) => {
    return dayjs(time1).diff(dayjs(time2), 'second');
  };
  const computedAverageData = (gameResults: gameResultsItemModal[]) => {
    const answerCorrectData: answerDataModal[] = [];
    const playerAnswerTimeData: answerTimeDataModal[] = [];
    const questionCount = gameResults[0]?.answers.length || 0; // Number of questions
    const playerCount = gameResults.length; // Number of players
    // const playerNameList = gameResults.map((item) => item.name); // Player name
    const questionLen: number[] = [];
    for (let i = 0; i < questionCount; i++) {
      questionLen.push(i);
    }
    const correctList: number[] = [];
    const timeList: number[] = [];
    questionLen.forEach((item) => {
      let currQuestionPoints = 0;
      let currQuestionTimeTotal = 0;
      gameResults.forEach((resultsItem, resIndex) => {
        currQuestionPoints += Number(
          resultsItem.answers[item * resIndex]?.correct
        );
        currQuestionTimeTotal +=
          diffTime(
            resultsItem.answers[item * resIndex]?.answeredAt,
            resultsItem.answers[item * resIndex]?.questionStartedAt
          ) || 20;
      });
      correctList.push(currQuestionPoints);
      timeList.push(currQuestionTimeTotal);
    });
    correctList.forEach((item) => {
      answerCorrectData.push({
        questionNum: '',
        correctAverage: item / playerCount,
      });
    });
    timeList.forEach((item) => {
      playerAnswerTimeData.push({
        questionNum: '',
        timeAverage: item / playerCount,
      });
    });
    setAnswersChartsData(answerCorrectData);
    setAnswersTimeChartsData(playerAnswerTimeData);
  };
  useEffect(() => {
    if (gameResults) {
      computedAverageData(gameResults);
      const currTableData = gameResults.map(
        (resultsItem: gameResultsItemModal, outIndex) => {
          let totalPoint = 0;
          let costTotalTime = 0;
          resultsItem.answers.forEach((answersItem, innerIndex) => {
            if (answersItem.correct) {
              totalPoint += currQuizPointsList[innerIndex] || 0;
            }
            // Calculate the total time taken
            const currAnswerCostTime =
              diffTime(answersItem.answeredAt, answersItem.questionStartedAt) ||
              20;
            costTotalTime += currAnswerCostTime;
          });
          return {
            key: outIndex,
            index: outIndex + 1,
            name: resultsItem.name,
            points: totalPoint,
            time: costTotalTime,
          };
        }
      );
      setTableData(currTableData.splice(0, 5));
    }
  }, [gameResults, currQuizPointsList]);

  useEffect(() => {
    getGameResult();
    getQuizDetailAction();
  }, []);

  const answersOption = {
    xAxis: {
      type: 'category',
      data: answersChartsData.map((item) => item.questionNum),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: answersChartsData.map((item) => item.correctAverage),
        type: 'bar',
      },
    ],
  };
  const answersTimeOption = {
    xAxis: {
      type: 'category',
      data: answersTimeChartsData.map((item) => item.questionNum),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: answersTimeChartsData.map((item) => item.timeAverage),
        type: 'line',
        smooth: true,
      },
    ],
  };
  const AnswersCharts = () => {
    return <ReactEcharts className="w-full sm:w-2/3" option={answersOption} />;
  };
  const AnswersTimeCharts = () => {
    return (
      <ReactEcharts className="w-full sm:w-2/3" option={answersTimeOption} />
    );
  };
  return (
    <>
      <Header></Header>
      <div className="flex flex-col items-center justify-center w-full p-6 bg-gray-100 ">
        <Row className="flex justify-center w-full">
          <Table
            title={() => 'game results'}
            className="w-full sm:w-2/3"
            pagination={false}
            dataSource={tableData}
            columns={columns}
          />
        </Row>
        <Row className="justify-center w-full">{AnswersCharts()}</Row>
        <Row className="justify-center w-full">{AnswersTimeCharts()}</Row>
      </div>
    </>
  );
};
export default GameResults;
