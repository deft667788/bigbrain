import { message } from 'antd';
import axios, { AxiosRequestHeaders } from 'axios';
import configData from '../config.json';

const http = axios.create({
  baseURL: 'http://127.0.0.1:' + configData.BACKEND_PORT
});

http.interceptors.request.use((axiosConfig) => {
  if (!axiosConfig.headers) {
    axiosConfig.headers = {} as AxiosRequestHeaders;
  }

  axiosConfig.headers.Authorization =
    // store.getState().user.loginData.Authorization ||
    localStorage.getItem('Authorization') || '';
  return axiosConfig;
});

http.interceptors.response.use(
  (response) => {
    if (response.headers.Authorization || response.data.token) {
      localStorage.setItem(
        'Authorization',
        response.headers.Authorization || response.data.token
      );
    }

    return response.data;
  },
  (error) => {
    const { data, status } = error.response;
    switch (status) {
      case 403:
        location.href = location.href + 'login';
        break;

      default:
        break;
    }
    message.error(data.error);
  }
);

export default http;
