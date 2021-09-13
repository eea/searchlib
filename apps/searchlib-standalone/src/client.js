import 'regenerator-runtime/runtime'; // compatibility with react-speech-recognition
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import { hydrate } from 'react-dom';

import '@eeacms/globalsearch/dist/index.css';

hydrate(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept();
}
