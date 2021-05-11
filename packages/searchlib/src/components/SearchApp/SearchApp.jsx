import React from 'react';

import {
  ErrorBoundary,
  SearchProvider,
  WithSearch,
} from '@elastic/react-search-ui';
import { AppConfigContext } from '@eeacms/search/lib/hocs';
import { SearchView } from '@eeacms/search/components';
import { rebind, applyConfigurationSchema } from '@eeacms/search/lib/utils';

// import '@elastic/react-search-ui-views/lib/styles/styles.css';

export default function SearchApp(props) {
  const { appName, registry } = props;

  const appConfig = React.useMemo(
    () => applyConfigurationSchema(rebind(registry.searchui[appName])),
    [appName, registry],
  );
  appConfig.debug = props.debug;

  const appConfigContext = { appConfig, registry };
  // console.log('appConfig', appConfig);

  return (
    <SearchProvider config={appConfig}>
      <WithSearch mapContextToProps={(context) => context}>
        {(params) => (
          <AppConfigContext.Provider value={appConfigContext}>
            <ErrorBoundary>
              <SearchView {...params} appName={appName} />
            </ErrorBoundary>
          </AppConfigContext.Provider>
        )}
      </WithSearch>
    </SearchProvider>
  );
}
