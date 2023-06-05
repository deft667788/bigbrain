import React, { useEffect, useState } from 'react';
import {
  Button,
  Row,
  Col,
  Input,
  Space,
  Form,
  message,
  Upload,
  Select,
  Radio,
  Checkbox,
  RadioChangeEvent,
} from 'antd';
import {
  LoadingOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import type { RcFile } from 'antd/es/upload/interface';
import { updateQuiz as updateQuizApi } from '../../http/apis/quizs/index';
import { getBase64 } from '../../utils';
import { pointsOptions, timeLimitOptions } from './data';
import { QuestionTypeTypeMap } from '../../enums/questionType';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/modules';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import Header from '../components/Header';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { QuestionItemModal } from '../../http/apis/quizs/types';

const EditQuestion = () => {
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const currQuizDetail = useSelector(
    (state: RootState) => state.quizReducer.currentQuizItemDetail
  );
  // Retrieve information about the current quiz stored in the store via redux

  const [imageUrl, setImageUrl] = useState<string>();
  const navigate = useNavigate();
  const {
    quizId: currQuizId,
    questionId: currQuestionId,
    type: currQuestionType = '',
  } = useParams();

  useEffect(() => {
    try {
      const findResCurrQuestionItem = currQuizDetail?.questions.find((item) => {
        return item.questionId === currQuestionId;
      });
      // console.log('findResCurrQuestionItem2', findResCurrQuestionItem);
      if (findResCurrQuestionItem) {
        form.setFieldsValue(findResCurrQuestionItem);
        form.setFieldValue('answers', findResCurrQuestionItem.answers);
        if (typeof findResCurrQuestionItem.rightAnswer === 'number') {
          setRightAnswer(findResCurrQuestionItem.rightAnswer);
        } else {
          setRightAnswers(findResCurrQuestionItem.rightAnswer);
        }
        setImageUrl(findResCurrQuestionItem?.img);
        // setTimeout(() => {
        //   form.setFieldValue('rightAnswer', findResCurrQuestionItem.rightAnswer);
        // }, 1000);
      }
    } catch (error) {
      navigate(-1);
    }
  }, [currQuizDetail]);

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
  };
  const customUploadFile = (e: UploadRequestOption<object>) => {
    setLoading(true);
    getBase64(e.file as RcFile, async (url) => {
      setLoading(false);
      setImageUrl(url);
    });
  };
  const previewImg = () => {
    return <img src={imageUrl} alt="thumbnail" style={{ width: '100%' }} />;
  };
  const [rightAnswer, setRightAnswer] = useState(0);
  const [rightAnswers, setRightAnswers] = useState<number[] | string[]>([]);

  const onFinish = async (values: QuestionItemModal) => {
    const currQuestionItem = {
      ...values,
      ...{
        questionId: currQuestionId,
        rightAnswer: Number(currQuestionType)
          ? rightAnswers.sort()
          : rightAnswer,
        img: imageUrl,
        questionType: Number(currQuestionType),
      },
    } as QuestionItemModal;
    if (currQuizId) {
      // If it's an edit question, find index in the questions of the current quiz
      // If the question is new, index = -1
      const findIndex = currQuizDetail.questions?.findIndex((item) => {
        return item.questionId === currQuestionItem.questionId;
      });
      // If you are editing a question, insert the current question in the index place as a replacement
      // If it's a new question, push to the end
      findIndex === -1
        ? currQuizDetail.questions.push(currQuestionItem)
        : currQuizDetail.questions.splice(findIndex, 1, currQuestionItem);
      const res = await updateQuizApi(currQuizId, {
        questions: currQuizDetail.questions,
      });
      if (res) {
        message.success('Save successfully');
        navigate(-1);
      }
    } else {
      throw new Error('error');
    }
  };
  const onRadioChange = (e: RadioChangeEvent) => {
    console.log(e.target.value);
    setRightAnswer(e.target.value);
  };
  const onCheckboxChange = (checkedValues: CheckboxValueType[]) => {
    setRightAnswers(JSON.parse(JSON.stringify(checkedValues)));
  };
  const cancelEdit = () => {
    navigate(-1);
  };

  const radioGroup = (index: number) => {
    return (
      <Radio.Group value={rightAnswer} onChange={onRadioChange} size="large">
        <Radio className="text-3xl" value={index}></Radio>
      </Radio.Group>
    );
  };

  const checkGroup = (index: number) => {
    return (
      <Checkbox className="text-3xl" value={index}>
        {/* {index} */}
      </Checkbox>
    );
  };

  return (
    <>
      <Header></Header>
      <div className="p-6 rounded-xl">
        <div className="flex flex-col justify-between p-2 border rounded-xl sm:p-6">
          <Form
            form={form}
            onFinish={(values) => {
              onFinish(values);
            }}
            layout="vertical"
            initialValues={{ points: 20, timeLimit: 20 }}
          >
            <Row justify="space-between" className="mt-4">
              <div>{QuestionTypeTypeMap.get(Number(currQuestionType))}</div>
              <Space wrap>
                <Form.Item name="points">
                  <Select style={{ width: 120 }} options={pointsOptions} />
                </Form.Item>
                <Form.Item name="timeLimit">
                  <Select style={{ width: 120 }} options={timeLimitOptions} />
                </Form.Item>
              </Space>
              <Space>
                <Form.Item>
                  <Button onClick={cancelEdit}>Canceling edits</Button>
                </Form.Item>
                {/* <Form.Item>
                <Button>Save and move on to the next problem</Button>
              </Form.Item> */}
                <Form.Item>
                  <Button htmlType="submit">Save questions</Button>
                </Form.Item>
              </Space>
            </Row>
            <Row gutter={16} justify="start" className="w-full mt-8">
              <Col sm={24} md={6} className="w-full ">
                <Upload
                  name="thumbnail"
                  listType="picture-card"
                  className="w-full "
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
              </Col>
              <Col sm={24} md={17} className="w-full">
                <Form.Item name="stem">
                  <Input.TextArea
                    rows={3}
                    className="w-full px-4 py-4 text-xl text-center sm:px-32 sm:py-10 sm:text-3xl"
                    placeholder="Enter the title here"
                  ></Input.TextArea>
                </Form.Item>
              </Col>
            </Row>

            <Form.List name="answers" initialValue={['', '']}>
              {(fields, { add, remove }, { errors }) => {
                return (
                  <Row
                    gutter={16}
                    justify="center"
                    className="flex flex-row justify-center w-full"
                  >
                    <Checkbox.Group
                      value={rightAnswers}
                      onChange={onCheckboxChange}
                      className="w-full"
                    >
                      <Row
                        gutter={16}
                        justify="space-around"
                        className="w-full"
                      >
                        {fields.map((field, index) => (
                          <Col
                            sm={24}
                            md={11}
                            key={field.key + index}
                            className="flex flex-row justify-around p-2 py-4 mt-6 align-middle border rounded-xl"
                          >
                            {Number(currQuestionType)
                              ? checkGroup(index)
                              : radioGroup(index)}
                            <Form.Item
                              required={false}
                              {...field}
                              validateTrigger={['onChange', 'onBlur']}
                              rules={[
                                {
                                  required: true,
                                  whitespace: true,
                                  message: 'Please enter options',
                                },
                              ]}
                              noStyle
                            >
                              <Input
                                placeholder="Please enter options"
                                style={{ width: '80%' }}
                              />
                            </Form.Item>
                            <MinusCircleOutlined
                              className="ml-2 text-2xl dynamic-delete-button col text-gray"
                              onClick={() => {
                                if (fields.length > 2) {
                                  remove(field.name);
                                } else {
                                  message.error('Keep at least two options open');
                                }
                              }}
                            />
                          </Col>
                        ))}
                      </Row>
                    </Checkbox.Group>
                    <Col span={24} className="mt-6">
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => {
                            if (fields.length < 6) {
                              add();
                              add();
                            }
                          }}
                          icon={<PlusOutlined />}
                        >
                          Add answer
                        </Button>
                        <Form.ErrorList errors={errors} />
                      </Form.Item>
                    </Col>
                  </Row>
                );
              }}
            </Form.List>
          </Form>
        </div>
      </div>
    </>
  );
};
export default EditQuestion;
