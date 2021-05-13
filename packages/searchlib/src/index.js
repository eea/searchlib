// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import SearchApp from './SearchApp';
// import * as serviceWorker from './serviceWorker';
//
// // import 'semantic-ui-css/semantic.min.css';
// import './semantic-ui.less';
// import registry from './registry';
// import installDemo from './demo';
//
// const demoRegistry = installDemo(registry);
//
// ReactDOM.render(
//   <SearchApp registry={demoRegistry} appName="wise" />,
//   document.getElementById('root'),
// );
//
// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

export * from './components';
export * from './lib/facets';
export * from './lib/utils';
export registry from './registry';
