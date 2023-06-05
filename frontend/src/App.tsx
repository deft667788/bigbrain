import { Layout } from 'antd';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard/index';
import SignIn from './pages/login/index';
import SignUp from './pages/register/index';
import EditQuiz from './pages/editQuiz/index';
import EditQuestion from './pages/editQuizQuestion/index';
import GameHall from './pages/gameHall/index';
import JoinPlay from './pages/joinPlay/index';
import GameResults from './pages/gameResults/index';

import { Provider } from 'react-redux';
import { store } from './store';
import './app.css';
const { Content } = Layout;

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Layout className="h-full">
          {/* <Header style={headerStyle}>Header</Header> */}
          <Content className="h-full text-center bg-white">
            <Routes>
              <Route path="/" Component={Dashboard}></Route>
              <Route path="/dashboard" Component={Dashboard}></Route>
              <Route path="/login" Component={SignIn}></Route>
              <Route path="/register" Component={SignUp}></Route>
              <Route path="/editQuiz/:id" Component={EditQuiz}></Route>
              <Route
                path="/editQuestion/:quizId/:questionId/:type"
                Component={EditQuestion}
              ></Route>
              <Route
                path="/gameHall/:quizId/:sessionId"
                Component={GameHall}
              ></Route>
              <Route path="/joinPlay/:sessionId" Component={JoinPlay}></Route>
              <Route
                path="/gameResults/:quizId/:sessionId"
                Component={GameResults}
              ></Route>
            </Routes>
          </Content>
        </Layout>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
