import React from 'react';

import {
  ErrorBoundary,
  SearchProvider,
  WithSearch,
} from '@elastic/react-search-ui';
import config from './registry';
import { AppConfigContext } from './lib/hocs';
import { SearchView } from './components';
import { rebind } from './utils';

import './semantic-ui.less';
import '@elastic/react-search-ui-views/lib/styles/styles.css';
// import 'semantic-ui-css/semantic.min.css';

export default function SearchApp(props) {
  const { appName } = props;

  const appConfig = React.useMemo(() => rebind(config.searchui[appName]), [
    appName,
  ]);

  return (
    <SearchProvider config={appConfig}>
      <WithSearch mapContextToProps={(context) => context}>
        {(params) => (
          <AppConfigContext.Provider value={appConfig}>
            <ErrorBoundary>
              <SearchView {...params} appConfig={appConfig} appName={appName} />
            </ErrorBoundary>
          </AppConfigContext.Provider>
        )}
      </WithSearch>
    </SearchProvider>
  );
}
