import React from 'react';
import { SearchApp, registry } from '@eeacms/search';

import installDemo from './config';

const demoRegistry = installDemo(registry);

class Home extends React.Component {
  render() {
    return <SearchApp registry={demoRegistry} appName="wise" />;
  }
}

export default Home;
