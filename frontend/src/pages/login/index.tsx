import React, { useState } from 'react';
import { Button, Avatar, Row, Col, Input, Form, Space } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../http/apis/users/user';
import { RegisterParam } from '../../http/apis/users/types';

const SignIn = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const onLogIn = (values: RegisterParam) => {
    login(values).then((result) => {
      if (result) {
        setTimeout(() => {
          navigate('/');
        }, 1000);
        setLoading(false);
      }
    });
  };
  return (
    <Space direction="vertical" size={'large'}>
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
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onLogIn}
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
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Row>
              <Button
                type="primary"
                block
                htmlType="submit"
                className="bg-blue-300 login-form-button"
                loading={loading}
              >
                Log in
              </Button>
            </Row>
            <Row>
              <Link to="/register">register now!</Link>
            </Row>
          </Form.Item>
        </Form>
      </Row>
    </Space>
  );
};
export default SignIn;
