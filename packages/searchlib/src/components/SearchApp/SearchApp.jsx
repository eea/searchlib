import React from 'react';

import { SearchProvider, WithSearch } from '@elastic/react-search-ui'; // ErrorBoundary,
import { AppConfigContext, SearchContext } from '@eeacms/search/lib/hocs';
import { SearchView } from '@eeacms/search/components/SearchView/SearchView';
import { rebind, applyConfigurationSchema } from '@eeacms/search/lib/utils';
import {
  onResultClick,
  onAutocompleteResultClick,
  onAutocomplete,
  onSearch,
} from '@eeacms/search/lib/request';

// import '@elastic/react-search-ui-views/lib/styles/styles.css';

export default function SearchApp(props) {
  const { appName, registry, mode = 'view' } = props;

  const appConfig = React.useMemo(
    () => applyConfigurationSchema(rebind(registry.searchui[appName])),
    [appName, registry],
  );

  const appConfigContext = { appConfig, registry };

  // <ErrorBoundary>
  // </ErrorBoundary>
  const searchFuncs = {
    // TODO: these needs to be read from the registry
    onResultClick: onResultClick.bind(appConfig),
    onAutocompleteResultClick: onAutocompleteResultClick.bind(appConfig),
    onAutocomplete: onAutocomplete.bind(appConfig),
    onSearch: onSearch.bind(appConfig),
  };

  const config = { ...appConfig, ...searchFuncs };
  return (
    <SearchProvider config={config}>
      <WithSearch mapContextToProps={(context) => context}>
        {(params) => {
          return (
            <AppConfigContext.Provider value={appConfigContext}>
              <SearchContext.Provider value={params}>
                <SearchView
                  {...params}
                  appName={appName}
                  appConfig={appConfig}
                  mode={mode}
                />
              </SearchContext.Provider>
            </AppConfigContext.Provider>
          );
        }}
      </WithSearch>
    </SearchProvider>
  );
}
