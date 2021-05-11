import React from 'react';
import ReactDOM from 'react-dom';
import { SearchApp } from '@eeacms/search';

import registry from '@eeacms/search/registry';
import installDemo from './demo';

// import '@eeacms/search/index.css';
// import 'semantic-ui-css/semantic.min.css';
import './semantic-ui.less';

const demoRegistry = installDemo(registry);

ReactDOM.render(
  <SearchApp registry={demoRegistry} appName="wise" />,
  document.getElementById('root'),
);
