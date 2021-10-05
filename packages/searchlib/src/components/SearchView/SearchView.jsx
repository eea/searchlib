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
import { checkInteracted } from './utils';
import { BodyContent } from './BodyContent';

export const SearchView = (props) => {
  const {
    addFilter,
    appConfig,
    appName,
    setCurrent,
    setSearchTerm,
    setSort,
    wasSearched,
    filters,
    searchTerm,
    mode = 'view',
  } = props;
  const { defaultSearchText = '' } = appConfig;

  const { driver } = React.useContext(SearchContext);

  const InitialViewComponent =
    appConfig.initialView?.factory &&
    registry.resolve[appConfig.initialView.factory].component;

  const FacetsComponent = appConfig.facetsListComponent
    ? registry.resolve[appConfig.facetsListComponent].component
    : Facets;

  // const itemViewProps = listingViewDef.params;
  const Layout = registry.resolve[appConfig.layoutComponent].component;

  const { defaultFilters } = appConfig;
  const wasInteracted = checkInteracted({ filters, searchTerm, appConfig });

  React.useEffect(() => {
    if (!wasSearched) {
      const state = driver.URLManager.getStateFromURL();
      setSearchTerm(state.searchTerm || defaultSearchText);

      // eslint-disable-next-line
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
            useSearchPhrases={appConfig.useSearchPhrases}
            inputView={
              appConfig.searchBoxInputComponent
                ? registry.resolve[appConfig.searchBoxInputComponent].component
                : undefined
            }
            view={
              appConfig.searchBoxComponent
                ? registry.resolve[appConfig.searchBoxComponent].component
                : undefined
            }
            mode={mode}
          />
        }
        sideContent={<FacetsComponent />}
        bodyHeader={wasInteracted ? <SUIPagingInfo view={PagingInfo} /> : null}
        bodyContent={<BodyContent {...props} wasInteracted={wasInteracted} />}
        bodyFooter={<AppInfo appConfig={appConfig} />}
      />
    </div>
  );
};

export default withAppConfig(SearchView);
