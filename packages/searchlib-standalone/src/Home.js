import React from 'react';
import { SearchApp, registry } from '@eeacms/search';

import installConfig from './config';

const localRegistry = installConfig(registry);

class Home extends React.Component {
  render() {
    return <SearchApp registry={localRegistry} appName="standalone" />;
  }
}

export default Home;
