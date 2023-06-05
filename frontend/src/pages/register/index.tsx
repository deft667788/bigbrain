import React, { useState } from 'react';
import { Button, Avatar, Row, Col, Input, Form, Space, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../http/apis/users/user';
import { RegisterParam } from '../../http/apis/users/types';

const formStyle: React.CSSProperties = {
  border: '1px solid #BFBFBF',
  minWidth: '400px',
  borderRadius: '20px',
  marginTop: '60px',
  padding: '30px',
};

const SignIn = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const onSignUp = (values: RegisterParam) => {
    setLoading(true);
    register(values)
      .then((result) => {
        if (result) {
          setTimeout(() => {
            navigate('/');
          }, 500);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
        message.success('register success!');
      });
  };
  return (
    <Space direction="vertical" size={'large'} style={formStyle}>
      <div></div>
      <Row align="middle">
        <Col flex={5}>
          <Row align="middle" justify="center">
            <Avatar size="large" icon={<UserOutlined />} />
          </Row>
        </Col>
      </Row>

      <Row justify="center">
        <Form
          name="normal_register"
          className="register-form"
          initialValues={{ remember: true }}
          onFinish={onSignUp}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="email"
            />
          </Form.Item>
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="name"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="password"
            />
          </Form.Item>
          <Form.Item>
            <Row>
              <Button
                type="primary"
                block
                htmlType="submit"
                className="bg-blue-400 register-form-button"
                loading={loading}
              >
                Register
              </Button>
            </Row>
            <Row>
              <Link to="/login">login now!</Link>
            </Row>
          </Form.Item>
        </Form>
      </Row>
    </Space>
  );
};
export default SignIn;
