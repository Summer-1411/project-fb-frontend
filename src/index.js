import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { DarkModeContextProvider } from './context/darkModeContext';
import ChatContextProvider from './context/chatContext';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react'
import 'react-toastify/dist/ReactToastify.css';
import { PostContextProvider } from './context/postContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <DarkModeContextProvider>
          <ChatContextProvider>
            <PostContextProvider>
              <App />
              <ToastContainer />
            </PostContextProvider>
          </ChatContextProvider>
        </DarkModeContextProvider>
      </PersistGate>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
