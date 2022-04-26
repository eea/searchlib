import React from 'react';

import { SearchProvider, WithSearch } from '@elastic/react-search-ui'; // ErrorBoundary,
import {
  AppConfigContext,
  SearchContext,
  useIsMounted,
} from '@eeacms/search/lib/hocs';
import { SearchView } from '@eeacms/search/components/SearchView/SearchView';
import { rebind, applyConfigurationSchema } from '@eeacms/search/lib/utils';
import {
  onResultClick,
  onAutocompleteResultClick,
  bindOnAutocomplete,
  bindOnSearch,
} from '@eeacms/search/lib/request';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { getFacetOptions } from './request';
import { resetFiltersToDefault } from '@eeacms/search/lib/search/helpers';

// import '@elastic/react-search-ui-views/lib/styles/styles.css';

function resetFilters() {
  const { appConfig, searchContext } = this;

  return resetFiltersToDefault(searchContext, appConfig);
}

function SearchApp(props) {
  const {
    appName,
    registry,
    mode = 'view',
    paramOnSearch = bindOnSearch,
    paramOnAutocomplete = bindOnAutocomplete,
  } = props;

  const appConfig = React.useMemo(
    () => applyConfigurationSchema(rebind(registry.searchui[appName])),
    [appName, registry],
  );

  const isMountedRef = useIsMounted();
  const [facetOptions, setFacetOptions] = React.useState(); // cache for all facet values, for some facets;

  const appConfigContext = React.useMemo(() => ({ appConfig, registry }), [
    appConfig,
    registry,
  ]);

  // <ErrorBoundary>
  // </ErrorBoundary>
  // const searchFuncs = {
  //   // TODO: these needs to be read from the registry
  //   onResultClick: onResultClick.bind(appConfig),
  //   onAutocompleteResultClick: onAutocompleteResultClick.bind(appConfig),
  //   onAutocomplete: onAutocomplete.bind(appConfig),
  //   onSearch: onSearch.bind(appConfig),
  // };
  const [isLoading, setIsLoading] = React.useState(false);

  const boundOnSearch = React.useMemo(() => paramOnSearch(appConfig), [
    appConfig,
    paramOnSearch,
  ]);
  const onSearch = React.useCallback(
    async (state) => {
      setIsLoading(true);
      console.log('searching');
      const res = await boundOnSearch(state);
      console.log('search done', res);
      setIsLoading(false);
      return res;
    },
    [boundOnSearch],
  );

  const onAutocomplete = React.useMemo(() => paramOnAutocomplete(appConfig), [
    appConfig,
    paramOnAutocomplete,
  ]);

  const config = React.useMemo(
    () => ({
      ...appConfig,
      onResultClick,
      onAutocompleteResultClick,
      onAutocomplete,
      onSearch,
      initialState: {
        resultsPerPage: appConfig.resultsPerPage || 20,
      },
    }),
    [appConfig, onAutocomplete, onSearch],
  );

  // construct a data structure of all available options for all the facets
  const fetchFacetOptions = React.useCallback(
    async (facetFieldNames) => {
      const facetNames = appConfig.facets
        .filter((f) => f.showAllOptions)
        .map((f) => f.field);
      const facetOptions = await getFacetOptions(appConfig, facetNames);
      isMountedRef.current && setFacetOptions(facetOptions);
    },
    [appConfig, isMountedRef],
  );

  const facetsWithAllOptions =
    appConfig.facets?.filter((f) => f.showAllOptions) || [];

  useDeepCompareEffect(() => {
    fetchFacetOptions(facetsWithAllOptions);
  }, [facetsWithAllOptions, fetchFacetOptions]);

  return (
    <SearchProvider config={config}>
      <WithSearch
        mapContextToProps={(searchContext) => ({
          ...searchContext,
          isLoading,
          resetFilters: resetFilters.bind({ appConfig, searchContext }),
          facetOptions,
        })}
      >
        {(params) => {
          // TODO: this needs to be optimized, it causes unmounts
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

export default React.memo(SearchApp, () => true);
