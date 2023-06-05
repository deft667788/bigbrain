import { AddQuizParamModel } from '../../../http/apis/quizs/types';
import { Button, Form, Input, Modal } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addQuiz as addQuizApi } from '../../../http/apis/quizs/index';

interface ModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (type: boolean) => void;
}

export const AddQuizModal: React.FC<ModalProps> = (props: ModalProps) => {
  const navigate = useNavigate();
  const { isModalOpen, setIsModalOpen } = props;
  const [addQuizLoading, setAddQuizLoading] = useState<boolean>(false);

  const onAddQuiz = async (values: AddQuizParamModel) => {
    setAddQuizLoading(true);
    const res = await addQuizApi(values);
    handleModalOk();
    navigate(`./editQuiz/${res.quizId}`);
    setAddQuizLoading(false);
  };
  const handleModalOk = () => {
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <Modal
      title="Add a new quiz"
      open={isModalOpen}
      onCancel={handleModalCancel}
      footer={null}
    >
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onAddQuiz}
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Please input quiz name!' }]}
        >
          <Input placeholder="name" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            block
            htmlType="submit"
            className="bg-blue-400 login-form-button"
            loading={addQuizLoading}
          >
            submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
