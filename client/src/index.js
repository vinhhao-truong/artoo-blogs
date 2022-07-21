import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Modal from 'react-modal';
import { Provider } from 'react-redux';
import userStore from './components/store/user/user-store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={userStore}>
    <App />
  </Provider>
);

Modal.setAppElement('#root');