import React from 'react';
import installDemo from './config';

import '@elastic/react-search-ui-views/lib/styles/styles.css';

const demoRegistry = installDemo(registry);

class Home extends React.Component {
  render() {
    return (
      __SERVER__ ? '' :
      <SearchApp registry={demoRegistry} appName="wise" />
    );
  }
}

export default Home;
