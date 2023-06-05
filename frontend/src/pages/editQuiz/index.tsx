import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Row,
  Col,
  Input,
  Space,
  message,
  Upload,
  Spin,
  Empty,
} from 'antd';
import { SaveOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import type { RcFile } from 'antd/es/upload/interface';
import {
  getQuizDetail as getQuizDetailApi,
  updateQuiz as updateQuizApi,
} from '../../http/apis/quizs/index';
import { getBase64 } from '../../utils';
import { QuestionItemModal, QuizItemModel } from '../..//http/apis/quizs/types';
import { QuestionCard } from './components/QuestionCard';
import { questionStatusEnum } from '../../enums/questionType';
import { store } from '../../store/index';
import { saveCurrQuizItemDetailData } from '../../store/modules/quiz/actions';
import { nanoid } from 'nanoid';
// import { v4 as uuidv4 } from 'uuid';
import Header from '../components/Header';
import { UploadRequestOption } from 'rc-upload/lib/interface';

const EditQuiz = () => {
  const [loading, setLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);
  // the current quiz detail
  const [currQuizDetail, setCurrQuizDetail] = useState<QuizItemModel>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [nameValue, setNameValue] = useState<string>('');
  const navigate = useNavigate();
  const { id: currQuizId = '' } = useParams();

  const getCurrQuizDetail = useCallback(async () => {
    setSpinning(true);
    const curr: QuizItemModel = await getQuizDetailApi(Number(currQuizId));
    store.dispatch(saveCurrQuizItemDetailData(curr));
    console.log('curr', curr);
    setCurrQuizDetail(curr);
    setImageUrl(curr.thumbnail);
    setNameValue(curr.name);
    setSpinning(false);
  }, [currQuizId]);

  useEffect(() => {
    getCurrQuizDetail();
  }, [getCurrQuizDetail]);

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return file;
  };
  const customUploadFile = (e: UploadRequestOption<object>) => {
    setLoading(true);
    getBase64(e.file as RcFile, async (url) => {
      await updateQuizApi(currQuizId, { thumbnail: url });
      setLoading(false);
      message.success('Uploaded image successfully ~');
      setImageUrl(url);
    });
  };
  const previewImg = () => {
    return <img src={imageUrl} alt="thumbnail" style={{ width: '100%' }} />;
  };
  // Skip to adding a new question
  const goEditQuestion = (type: number) => {
    navigate(`/editQuestion/${currQuizId}/${nanoid()}/${type}`);
  };
  // Save the title of the quiz
  const confirmEditName = async () => {
    setLoading(true);
    await updateQuizApi(currQuizId, { name: nameValue });
    message.success('Saved successfully ~');
    setLoading(false);
  };

  // delete one question
  const delQuestion = async (questionId: string) => {
    const targetIndex = currQuizDetail?.questions.findIndex(
      (item: QuestionItemModal) => item.questionId === questionId
    );
    if (currQuizDetail && targetIndex !== undefined) {
      currQuizDetail?.questions.splice(targetIndex, 1);
      const newDetail = {
        ...currQuizDetail,
        questions: currQuizDetail?.questions,
      };
      setCurrQuizDetail(newDetail);
      await updateQuizApi(currQuizId, newDetail);
    }
    message.success('Delete successfully ~');
  };
  // save the whole quiz
  const saveQuiz = () => {
    navigate(-1);
  };
  const empty = () => {
    return <Empty description="no question" />;
  };
  return (
    <>
      <Header></Header>
      <div className="min-h-full p-2 bg-gray-100 sm:p-10">
        <Spin spinning={spinning}></Spin>
        <Row justify="end" className="p-6 border-gray-400 rounded-xl">
          <Space>
            <Button
              onClick={() => {
                goEditQuestion(questionStatusEnum.RADIO);
              }}
            >
              + single choice
            </Button>
            <Button
              onClick={() => {
                goEditQuestion(questionStatusEnum.CHECKBOX);
              }}
            >
              + multiple choice
            </Button>
            <Button
              icon={<SaveOutlined />}
              style={{ color: '#479E01' }}
              onClick={saveQuiz}
            >
              Save Quiz
            </Button>
          </Space>
        </Row>
        <Row gutter={32} justify="space-between" className="h-full p-6 ">
          <Col
            xs={24}
            sm={24}
            md={7}
            lg={7}
            xl={7}
            className="pb-6 bg-white rounded-lg"
          >
            <Space direction="vertical">
              <Row>
                <Upload
                  name="thumbnail"
                  listType="picture-card"
                  className="thumbnail-uploader"
                  method="put"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  customRequest={(e) => {
                    customUploadFile(e);
                  }}
                  style={{ width: '100%' }}
                >
                  {imageUrl ? previewImg() : uploadButton}
                </Upload>
              </Row>
              <Row gutter={16} className="flex flex-col">
                <Input
                  allowClear
                  name="name"
                  value={nameValue}
                  onChange={(e) => {
                    setNameValue(e.target.value);
                  }}
                  placeholder="name"
                />
                <Button
                  loading={loading}
                  onClick={confirmEditName}
                  className="mt-2"
                >
                  Saving changes
                </Button>
              </Row>
            </Space>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={15}
            lg={15}
            xl={15}
            className="pb-6 mt-6 bg-white rounded-lg sm:mt-0 sm:ml-6"
          >
            <Row className="w-full pt-4 text-center">
              <span>Question</span>
            </Row>
            {!currQuizDetail?.questions.length ? empty() : ''}
            {currQuizDetail?.questions.map((item) => {
              return (
                <Row key={item.questionId}>
                  <QuestionCard
                    quizId={currQuizId}
                    item={item}
                    delQuestion={delQuestion}
                  ></QuestionCard>
                </Row>
              );
            })}
          </Col>
        </Row>
      </div>
    </>
  );
};
export default EditQuiz;
