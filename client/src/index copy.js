import React from 'react';
import ReactDOM from 'react-dom/client';
import './custom.scss';
import App from './App';


//removed the following lines to customize bootstrap
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
