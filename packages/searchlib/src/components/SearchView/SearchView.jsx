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
  AnswersList,
  DownloadButton,
  AppInfo,
} from '@eeacms/search/components';
import registry from '@eeacms/search/registry';
import { SearchContext } from '@elastic/react-search-ui';

// const isInteracted = (state, appConfig) => {
//   const res =
//     Object.keys(state).filter((k) => k !== 'resultsPerPage').length !== 0;
//   return res;
// };

export const SearchView = (props) => {
  // console.log('searchview props', props);
  const {
    addFilter,
    appConfig,
    appName,
    filters,
    searchTerm,
    setCurrent,
    setSearchTerm,
    setSort,
    wasSearched,
  } = props;
  const { defaultSearchText = '' } = appConfig;

  const { driver } = React.useContext(SearchContext);

  // console.log('was searched', wasSearched);

  const { sortOptions, resultViews } = appConfig;
  const defaultViewId =
    resultViews.filter((v) => v.isDefault)[0]?.id || 'listing';
  const [activeViewId, setActiveViewId] = React.useState(defaultViewId);

  const listingViewDef = resultViews.filter((v) => v.id === activeViewId)[0];

  const Item = registry.resolve[listingViewDef.factories.item].component;
  const ResultViewComponent =
    registry.resolve[listingViewDef.factories.view].component;

  const InitialViewComponent =
    appConfig.initialView?.factory &&
    registry.resolve[appConfig.initialView.factory].component;
  // console.log('initial', InitialViewComponent);

  const NoResultsComponent =
    appConfig.noResultsView?.factory &&
    registry.resolve[appConfig.noResultsView?.factory].component;

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
  const { defaultFilters } = appConfig;
  const wasInteracted = filters.length > 0 || searchTerm;

  React.useEffect(() => {
    if (!wasSearched) {
      //&& !InitialViewComponent
      const state = driver.URLManager.getStateFromURL();
      setSearchTerm(defaultSearchText);

      state.filters?.forEach((f) => addFilter(f.field, f.values, f.type));

      if (state.current) {
        setCurrent(state.current);
      }
      if (state.sortField) {
        setSort(state.sortField, state.sortDirection);
      }

      if (defaultFilters) {
        const presetFilters = state?.filters?.map((filter) => filter.field);
        Object.keys(defaultFilters).forEach((k) => {
          const { value, type = 'any' } = defaultFilters[k];
          if (!presetFilters || presetFilters?.indexOf(k) === -1) {
            addFilter(k, value, type);
          }
        });
      }
    }
  }, [
    appConfig,
    wasSearched,
    setSearchTerm,
    defaultSearchText,
    driver,
    addFilter,
    setCurrent,
    setSort,
    InitialViewComponent,
    defaultFilters,
  ]);

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
            inputView={
              appConfig.searchBoxComponent
                ? registry.resolve[appConfig.searchBoxComponent].component
                : undefined
            }
          />
        }
        sideContent={<Facets />}
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

            <AnswersList />

            <Results
              shouldTrackClickThrough={true}
              view={({ children }) => {
                return wasInteracted ? (
                  NoResultsComponent ? (
                    children ? (
                      <ResultViewComponent>{children}</ResultViewComponent>
                    ) : (
                      <NoResultsComponent {...props} />
                    )
                  ) : (
                    <ResultViewComponent>{children}</ResultViewComponent>
                  )
                ) : InitialViewComponent ? (
                  <InitialViewComponent {...props} />
                ) : (
                  <ResultViewComponent>{children}</ResultViewComponent>
                );
              }}
              resultView={(props) => (
                <Result {...props} {...itemViewProps} view={Item} />
              )}
            />
          </>
        }
        bodyFooter={
          <div className="row">
            <div>
              <DownloadButton appConfig={appConfig} />
            </div>
            <div className="search-body-footer">
              <div></div>
              <Paging />
              <ResultsPerPage />
            </div>
            <AppInfo appConfig={appConfig} />
          </div>
        }
      />
    </div>
  );
};

export default withAppConfig(SearchView);
