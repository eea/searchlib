import React from 'react';
import { useAtom } from 'jotai';
import { SearchContext } from '@elastic/react-search-ui';

import { withAppConfig } from '@eeacms/search/lib/hocs';
import { FacetsList, SearchBox, AppInfo } from '@eeacms/search/components';
import registry from '@eeacms/search/registry';

import { checkInteracted } from './utils';
import { getDefaultFilterValues } from '@eeacms/search/lib/utils';
import { BodyContent } from './BodyContent';
import { isLandingPageAtom } from './state';
import { useSearchContext } from '@eeacms/search/lib/hocs';

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
    // searchTerm,
    mode = 'view',
  } = props;
  const { defaultSearchText = '' } = appConfig;

  const [isLandingPage, setIsLandingPageAtom] = useAtom(isLandingPageAtom);
  const { driver } = React.useContext(SearchContext);

  const InitialViewComponent =
    appConfig.initialView?.factory &&
    registry.resolve[appConfig.initialView.factory].component;

  const FacetsListComponent = appConfig.facetsListComponent
    ? registry.resolve[appConfig.facetsListComponent].component
    : FacetsList;

  // const itemViewProps = listingViewDef.params;
  const Layout = registry.resolve[appConfig.layoutComponent].component;

  const { facets } = appConfig;

  const defaultFilterValues = React.useMemo(
    () => getDefaultFilterValues(facets),
    [facets],
  );

  // const searchedTerm = driver.URLManager.getStateFromURL().searchTerm;
  const searchContext = useSearchContext();
  const { resultSearchTerm } = searchContext;
  const wasInteracted = checkInteracted({
    wasSearched,
    filters,
    searchTerm: resultSearchTerm, //: searchedTerm,
    appConfig,
  });

  React.useEffect(() => {
    setIsLandingPageAtom(!wasInteracted);
  });

  const customClassName = isLandingPage ? 'landing-page' : 'simple-page';

  React.useEffect(() => {
    // TODO: use searchui alwaysSearchOnInitialLoad ?
    if (!wasSearched && !InitialViewComponent) {
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

      if (defaultFilterValues) {
        const presetFilters = state?.filters?.map((filter) => filter.field);
        Object.keys(defaultFilterValues).forEach((k) => {
          const { values, type = 'any' } = defaultFilterValues[k];
          if (!presetFilters || presetFilters?.indexOf(k) === -1) {
            addFilter(k, values, type);
          }
        });
      }
    }
  }, [
    appConfig,
    wasSearched,
    setSearchTerm,
    defaultSearchText,
    defaultFilterValues,
    driver,
    addFilter,
    setCurrent,
    setSort,
    InitialViewComponent,
  ]);

  return (
    <div className={`searchapp searchapp-${appName} ${customClassName}`}>
      <Layout
        appConfig={appConfig}
        header={
          <SearchBox
            searchContext={searchContext}
            isLandingPage={isLandingPage}
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
        sideContent={<FacetsListComponent />}
        bodyHeader={null}
        bodyContent={<BodyContent {...props} wasInteracted={wasInteracted} />}
        bodyFooter={<AppInfo appConfig={appConfig} />}
      />
    </div>
  );
};

export default withAppConfig(SearchView);
