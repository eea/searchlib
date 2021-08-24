import React from 'react';
import { SearchApp, registry } from '@eeacms/search';

import installConfig from './config';

const localRegistry = installConfig(registry);

class SearchPage extends React.Component {
  render() {
    console.log('localRegistry', localRegistry);
    return (
      <SearchApp
        registry={localRegistry}
        appName={process.env.RAZZLE_APP_NAME || 'standalone'}
      />
    );
  }
}

export default SearchPage;
