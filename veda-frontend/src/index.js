<<<<<<< HEAD
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';  // <-- import BrowserRouter
=======
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";   // <-- ye import missing tha
import "./index.css";
import App from "./App";
>>>>>>> 62454e01c2ff14632e3a53d4dbf10e258251dac3

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
<<<<<<< HEAD
    <BrowserRouter>          {/* <-- wrap App with BrowserRouter */}
=======
    <BrowserRouter>
>>>>>>> 62454e01c2ff14632e3a53d4dbf10e258251dac3
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
<<<<<<< HEAD

reportWebVitals();
=======
>>>>>>> 62454e01c2ff14632e3a53d4dbf10e258251dac3
