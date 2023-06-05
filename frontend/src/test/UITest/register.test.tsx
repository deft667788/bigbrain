import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RegisterComponent from '../../pages/register/index';
describe('Test Register Logic', () => {
  test('renders the component', async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <RegisterComponent />
      </MemoryRouter>
    );
    // 模拟用户输入注册信息
    const nameInput = screen.getByPlaceholderText('name');
    const emailInput = screen.getByPlaceholderText('email');
    const passwordInput = screen.getByPlaceholderText('password');
    fireEvent.change(nameInput, { target: { value: 'abc' } });
    fireEvent.change(emailInput, { target: { value: 'test@email.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    // 模拟用户点击注册按钮
    const registerButton = screen.getByText('Register');
    fireEvent.click(registerButton);
    // 等待异步请求返回并验证登录是否成功
    const successMessage = await screen.findByText('register success!');
    expect(successMessage).toBeInTheDocument();
  });
});
