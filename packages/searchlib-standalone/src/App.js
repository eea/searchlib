import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './Home';

import '@elastic/react-search-ui-views/lib/styles/styles.css';

import './semantic-ui.less';

const App = () => (
  <Switch>
    <Route exact path="/" component={Home} />
  </Switch>
);

export default App;
