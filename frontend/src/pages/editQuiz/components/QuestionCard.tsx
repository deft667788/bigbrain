import { Popconfirm, Image, Radio, Checkbox } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import React, { CSSProperties } from 'react';
import { QuestionItemModal } from '../../../http/apis/quizs/types';
import { useNavigate } from 'react-router-dom';
import { QuestionTypeTypeMap } from '../../../enums/questionType';

interface CardProps {
  quizId: string;
  item: QuestionItemModal;
  delQuestion: (questionId: string) => void;
}
export const QuestionCard: React.FC<CardProps> = (props: CardProps) => {
  const navigate = useNavigate();
  const { item: QuestionItem, delQuestion, quizId } = props;
  const {
    questionId,
    questionType,
    answers,
    rightAnswer,
    stem,
    img,
  } = QuestionItem;
  const delIconStyle: CSSProperties = {
    color: '#C41E7F',
  };
  const delQuiz = async () => {
    delQuestion(questionId);
  };
  const editQuestion = () => {
    navigate(`/editQuestion/${quizId}/${questionId}/${questionType}`);
    console.log('edit');
  };
  const showAnswers = () => {
    if (typeof rightAnswer === 'number') {
      return (
        <Radio.Group defaultValue={rightAnswer}>
          {answers.map((item, index) => {
            return (
              <Radio key={item + index} value={index} disabled>
                {item}
              </Radio>
            );
          })}
        </Radio.Group>
      );
    } else {
      return (
        <Checkbox.Group defaultValue={rightAnswer}>
          {answers.map((item, index) => {
            return (
              <Checkbox key={item + index} value={index} disabled>
                {item}
              </Checkbox>
            );
          })}
        </Checkbox.Group>
      );
    }
  };
  return (
    <div className="flex flex-row w-full p-4 mt-5 border rounded-md min-w-64 border-dark-50">
      <Image
        alt="question img"
        width={220}
        height={160}
        className="object-cover border rounded-md min-w-52 border-cool-gray-50"
        preview={false}
        src={img}
      />
      <div className="flex flex-col justify-between w-full ml-4">
        <div className="flex flex-col text-left">
          <span className="text-xl font-medium">{stem}</span>
          <span className="text-base">
            {QuestionTypeTypeMap.get(Number(questionType))}
            {questionId}
          </span>
        </div>
        <div>{showAnswers()}</div>
        <div className="flex flex-row justify-end">
          <EditOutlined
            onClick={editQuestion}
            key="edit"
            className="text-2xl to-cool-gray-700"
          />
          <Popconfirm
            title="Delete the question"
            description="Are you sure to delete this question?"
            onConfirm={delQuiz}
            okText="Yes"
            cancelText="No"
            key="delete"
            className="ml-6 text-2xl"
          >
            <DeleteOutlined style={delIconStyle} />
          </Popconfirm>
        </div>
      </div>
    </div>
  );
};
