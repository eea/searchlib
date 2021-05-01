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
import config from './registry';
import { AppConfigContext } from './lib/hocs';
import { Facets, ViewSelector } from './components';
import { rebind } from './utils';

import './semantic-ui.less';
import '@elastic/react-search-ui-views/lib/styles/styles.css';
// import 'semantic-ui-css/semantic.min.css';

export default function SearchApp(props) {
  const { appName } = props;

  const appConfig = React.useMemo(() => {
    return rebind(config.searchui[appName]);
  }, [appName]);

  return (
    <SearchProvider config={appConfig}>
      <WithSearch mapContextToProps={(context) => context}>
        {(params) => (
          <AppConfigContext.Provider value={appConfig}>
            <ErrorBoundary>
              <SearchLayout
                {...params}
                appConfig={appConfig}
                appName={appName}
              />
            </ErrorBoundary>
          </AppConfigContext.Provider>
        )}
      </WithSearch>
    </SearchProvider>
  );
}

export const SearchLayout = (props) => {
  const { wasSearched, setSearchTerm, appConfig, appName } = props;

  React.useEffect(() => {
    if (!wasSearched) {
      setSearchTerm('');
    }
  }, [wasSearched, setSearchTerm]);

  const { sortOptions, listingViews } = appConfig;
  const defaultViewId =
    listingViews.filter((v) => v.isDefault)[0]?.id || 'listing';
  const [activeViewId, setActiveViewId] = React.useState(defaultViewId);
  const view = listingViews.filter((v) => v.id === activeViewId)[0];
  const Item = view.itemComponent;
  const ResultViewComponent = view.viewComponent;
  const itemViewProps = view.params;
  const Layout = appConfig.layoutComponent;

  return (
    <div className={`searchapp searchapp-${appName}`}>
      <Layout
        header={
          <SearchBox
            autocompleteMinimumCharacters={3}
            autocompleteSuggestions={true}
          />
        }
        sideContent={
          <>
            <Sorting label={'Sort by'} sortOptions={sortOptions} />
            <Facets />
          </>
        }
        bodyContent={
          <>
            <ViewSelector
              views={listingViews}
              active={activeViewId}
              onSetView={setActiveViewId}
            />
            <Results
              shouldTrackClickThrough={true}
              view={({ children }) => {
                return <ResultViewComponent>{children}</ResultViewComponent>;
              }}
              resultView={(props) => (
                <Result {...props} {...itemViewProps} view={Item} />
              )}
            />
          </>
        }
        bodyHeader={
          <>
            <PagingInfo />
            <ResultsPerPage />
          </>
        }
        bodyFooter={<Paging />}
      />
    </div>
  );
};
