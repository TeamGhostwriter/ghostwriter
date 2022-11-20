import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Home';
import { BrowserRouter, Switch, Route, Routes } from "react-router-dom";
import SocialPage from './SocialPage';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/SocialPage" element={ <SocialPage /> }></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);