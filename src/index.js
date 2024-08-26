import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './routes/Home';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/Root';
import Login from './routes/Login';
import Signup from './routes/Signup';
import Chat from './routes/Chat';
import GroupChat from './routes/GroupChat';
import Profile from './routes/Profile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'signup',
        element: <Signup />,
      },
      {
        path: 'chat/:recipientid',
        element: <Chat />,
      },
      {
        path: 'chat/group/:groupid',
        element: <GroupChat />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
