import React from 'react';

import {
  ErrorBoundary,
  SearchProvider,
  WithSearch,
} from '@elastic/react-search-ui';
import { AppConfigContext } from './lib/hocs';
import { SearchView } from './components';
import { rebind } from './utils';

import '@elastic/react-search-ui-views/lib/styles/styles.css';

export default function SearchApp(props) {
  const { appName, registry } = props;

  const appConfig = React.useMemo(() => rebind(registry.searchui[appName]), [
    appName,
    registry,
  ]); // TODO: also expose registry

  const context = { appConfig, registry };

  return (
    <SearchProvider config={appConfig}>
      <WithSearch mapContextToProps={(context) => context}>
        {(params) => (
          <AppConfigContext.Provider value={context}>
            <ErrorBoundary>
              <SearchView {...params} appConfig={appConfig} appName={appName} />
            </ErrorBoundary>
          </AppConfigContext.Provider>
        )}
      </WithSearch>
    </SearchProvider>
  );
}
