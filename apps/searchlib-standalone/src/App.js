import React from 'react';
import { Route, Switch } from 'react-router-dom';
import SearchPage from './SearchPage';

import '@elastic/react-search-ui-views/lib/styles/styles.css';

import './semantic-ui.less';

const App = () => (
  <Switch>
    <Route exact path="/" component={SearchPage} />
  </Switch>
);

export default App;
