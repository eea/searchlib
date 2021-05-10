import React from 'react';
import ReactDOM from 'react-dom';
import '@eeacms/search/index.css';
import SearchApp from '@eeacms/search/SearchApp';

// import 'semantic-ui-css/semantic.min.css';
import '@eeacms/search/semantic-ui.less';
import registry from '@eeacms/search/registry';
import installDemo from './demo';

const demoRegistry = installDemo(registry);

ReactDOM.render(
  <SearchApp registry={demoRegistry} appName="wise" />,
  document.getElementById('root'),
);
