import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
// import reportWebVitals from './reportWebVitals';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
// no stict mode
// root.render(
//   <BrowserRouter>
//     <App />
//   </BrowserRouter>
// );
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();