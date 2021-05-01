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

  const { sortOptions, resultViews } = appConfig;
  const defaultViewId =
    resultViews.filter((v) => v.isDefault)[0]?.id || 'listing';
  const [activeViewId, setActiveViewId] = React.useState(defaultViewId);
  const listingViewDef = resultViews.filter((v) => v.id === activeViewId)[0];
  const Item = listingViewDef.itemComponent;
  const ResultViewComponent = listingViewDef.viewComponent;
  const itemViewProps = listingViewDef.params;
  const Layout = appConfig.layoutComponent;

  const availableResultViews = [
    ...resultViews.filter(({ id }) =>
      Object.keys(appConfig).includes(`${id}ViewParams`)
        ? appConfig[`${id}ViewParams`].enabled
        : true,
    ),
  ];

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
              views={availableResultViews}
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
