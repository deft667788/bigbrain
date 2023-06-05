import { Button } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../http/apis/users/user';

const CountDown: React.FC = () => {
  const navigate = useNavigate();
  const handelLogout = async () => {
    await logout();
    localStorage.removeItem('Authorization');
    navigate('/login');
  };
  return (
    <div className="flex items-center justify-end w-full h-16 p-6 bg-slate-500">
      <Button onClick={handelLogout}>log out</Button>
    </div>
  );
};
export default CountDown;
