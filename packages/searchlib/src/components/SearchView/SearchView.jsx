import React from 'react';
import {
  SearchBox,
  Results,
  Result,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting,
} from '@elastic/react-search-ui';
import { Facets, ViewSelector } from '@eeacms/search/components';

const SearchView = (props) => {
  const { wasSearched, setSearchTerm, appConfig, appName } = props;
  const { defaultSearchText } = appConfig;

  React.useEffect(() => {
    if (!wasSearched) {
      setSearchTerm(defaultSearchText);
    }
  }, [wasSearched, setSearchTerm, defaultSearchText]);

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

export default SearchView;
