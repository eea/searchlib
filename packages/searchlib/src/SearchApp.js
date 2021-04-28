import React from 'react';

import {
  ErrorBoundary,
  SearchProvider,
  WithSearch,
  SearchBox,
  Results,
  Result,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting,
} from '@elastic/react-search-ui';
import { Layout } from '@elastic/react-search-ui-views'; // SingleSelectFacet
import '@elastic/react-search-ui-views/lib/styles/styles.css';
import config from './registry';
import { AppConfigContext } from './lib/hocs';
import { Facets } from './components';
import './semantic-ui.less';
import isFunction from 'lodash.isfunction';
import cloneDeep from 'lodash.clonedeep';
// import 'semantic-ui-css/semantic.min.css';

function rebind(config) {
  // rebinds functions to the "activated" config
  return Object.assign(
    {},
    ...Object.keys(config).map((name) => ({
      [name]: isFunction(config[name])
        ? config[name].bind(config)
        : config[name],
    })),
  );
}

export default function App(props) {
  const { appName = 'wise' } = props;

  const appConfig = React.useMemo(() => {
    return rebind(cloneDeep(config.searchui[appName]));
  }, [appName]);

  return (
    <SearchProvider config={appConfig}>
      <WithSearch mapContextToProps={(context) => context}>
        {(params) => (
          <Search {...params} appConfig={appConfig} appName={appName} />
        )}
      </WithSearch>
    </SearchProvider>
  );
}

export const Search = (props) => {
  const { wasSearched, setSearchTerm, appConfig, appName } = props;

  React.useEffect(() => {
    if (!wasSearched) {
      setSearchTerm('');
    }
  }, [wasSearched, setSearchTerm]);

  const { sortOptions, listingViews } = appConfig;
  const view = listingViews[0];
  const Item = view.itemComponent;
  const itemViewProps = view.params;

  return (
    <div className={`App searchapp-${appName}`}>
      <AppConfigContext.Provider value={appConfig}>
        <ErrorBoundary>
          <Layout
            header={
              <SearchBox
                autocompleteMinimumCharacters={3}
                autocompleteSuggestions={true}
              />
            }
            sideContent={
              <div>
                {wasSearched && (
                  <Sorting label={'Sort by'} sortOptions={sortOptions} />
                )}

                <Facets />
              </div>
            }
            bodyContent={
              <Results
                titleField="Measure name"
                urlField="CodeCatalogue"
                shouldTrackClickThrough={true}
                resultView={(props) => (
                  <Result {...props} {...itemViewProps} view={Item} />
                )}
              />
            }
            bodyHeader={
              <React.Fragment>
                <PagingInfo />
                <ResultsPerPage />
              </React.Fragment>
            }
            bodyFooter={<Paging />}
          />
        </ErrorBoundary>
      </AppConfigContext.Provider>
    </div>
  );
};
