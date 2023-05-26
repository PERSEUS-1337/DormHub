import React from 'react';
import ReactDOM from 'react-dom/client';
import './custom.scss';
import App from './App';

// import 'bootstrap/dist/css/bootstrap.min.css'; //removed this line for simple customization of bootstrap
import 'bootstrap/dist/js/bootstrap.min.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);