import React from 'react';

import { SearchProvider, WithSearch } from '@elastic/react-search-ui'; // ErrorBoundary,
import { AppConfigContext, SearchContext } from '@eeacms/search/lib/hocs';
import { SearchView } from '@eeacms/search/components/SearchView/SearchView';
import { rebind, applyConfigurationSchema } from '@eeacms/search/lib/utils';

// import '@elastic/react-search-ui-views/lib/styles/styles.css';

export default function SearchApp(props) {
  const { appName, registry } = props;

  const appConfig = React.useMemo(
    () => applyConfigurationSchema(rebind(registry.searchui[appName])),
    [appName, registry],
  );

  const appConfigContext = { appConfig, registry };

  // <ErrorBoundary>
  // </ErrorBoundary>

  return (
    <SearchProvider config={appConfig}>
      <WithSearch mapContextToProps={(context) => context}>
        {(params) => {
          return (
            <AppConfigContext.Provider value={appConfigContext}>
              <SearchContext.Provider value={params}>
                <SearchView
                  {...params}
                  appName={appName}
                  appConfig={appConfig}
                />
              </SearchContext.Provider>
            </AppConfigContext.Provider>
          );
        }}
      </WithSearch>
    </SearchProvider>
  );
}
