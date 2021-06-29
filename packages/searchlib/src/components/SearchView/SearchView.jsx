import React from 'react';
import { withAppConfig } from '@eeacms/search/lib/hocs';
import {
  Results,
  Result,
  ResultsPerPage,
  Paging,
  Sorting,
  PagingInfo as SUIPagingInfo,
} from '@elastic/react-search-ui';
import {
  Facets,
  ViewSelector,
  FilterList,
  SearchBox,
  PagingInfo,
  SortingDropdown,
} from '@eeacms/search/components';
import registry from '@eeacms/search/registry';
import { SearchContext } from '@elastic/react-search-ui';

export const SearchView = (props) => {
  // console.log('searchview props', props);
  const {
    wasSearched,
    setSearchTerm,
    addFilter,
    appConfig,
    appName,
    setCurrent,
    setSort,
  } = props;
  const { defaultSearchText = '' } = appConfig;

  const { driver } = React.useContext(SearchContext);

  React.useEffect(() => {
    if (!wasSearched) {
      setSearchTerm(defaultSearchText);

      const state = driver.URLManager.getStateFromURL();

      state.filters?.forEach((f) => addFilter(f.field, f.values, f.type));

      if (state.current) {
        setCurrent(state.current);
      }
      if (state.sortField) {
        setSort(state.sortField, state.sortDirection);
      }
      addFilter('language', 'en', 'any');
    }
  }, [
    wasSearched,
    setSearchTerm,
    defaultSearchText,
    driver,
    addFilter,
    setCurrent,
    setSort,
  ]);

  const { sortOptions, resultViews } = appConfig;
  const defaultViewId =
    resultViews.filter((v) => v.isDefault)[0]?.id || 'listing';
  const [activeViewId, setActiveViewId] = React.useState(defaultViewId);

  const listingViewDef = resultViews.filter((v) => v.id === activeViewId)[0];

  const Item = registry.resolve[listingViewDef.factories.item].component;
  const ResultViewComponent =
    registry.resolve[listingViewDef.factories.view].component;

  // const itemViewProps = listingViewDef.params;
  const itemViewProps = appConfig[`${activeViewId}ViewParams`];
  const Layout = registry.resolve[appConfig.layoutComponent].component;

  const availableResultViews = [
    ...resultViews.filter(({ id }) => {
      const paramsPropId = `${id}ViewParams`;
      return Object.keys(appConfig).includes(paramsPropId)
        ? appConfig[paramsPropId].enabled
        : true;
    }),
  ];

  return (
    <div className={`searchapp searchapp-${appName}`}>
      <Layout
        appConfig={appConfig}
        header={
          <SearchBox
            autocompleteMinimumCharacters={3}
            autocompleteResults={appConfig.autocomplete.results}
            autocompleteSuggestions={appConfig.autocomplete.suggestions}
            shouldClearFilters={false}
          />
        }
        sideContent={
          <>
            <Facets />
          </>
        }
        bodyHeader={<SUIPagingInfo view={PagingInfo} />}
        bodyContent={
          <>
            <h1>{appConfig.title}</h1>
            <FilterList {...props} />

            <div className="above-results">
              <ViewSelector
                views={availableResultViews}
                active={activeViewId}
                onSetView={setActiveViewId}
              />
              <Sorting
                label={'Order'}
                sortOptions={sortOptions}
                view={SortingDropdown}
              />
            </div>

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
        bodyFooter={
          <>
            <div className="search-body-footer">
              <ResultsPerPage />
            </div>
            <Paging />
          </>
        }
      />
    </div>
  );
};

export default withAppConfig(SearchView);
