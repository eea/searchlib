import React from 'react';
import { Button } from 'semantic-ui-react';
import {
  ResultsPerPage,
  Paging,
  Sorting,
  PagingInfo as SUIPagingInfo,
} from '@elastic/react-search-ui';
import {
  ViewSelectorWithLabel,
  InlineFilterList,
  SortingDropdownWithLabel,
  AnswersList,
  DownloadButton,
} from '@eeacms/search/components';
import registry from '@eeacms/search/registry';
import { useAtom } from 'jotai';
import { showFacetsAsideAtom } from '@eeacms/search/state';

export const FilterAsideContentView = (props) => {
  const { appConfig, activeViewId, setActiveViewId, children } = props;
  const { sortOptions, resultViews } = appConfig;

  const listingViewDef = resultViews.filter((v) => v.id === activeViewId)[0];
  const ResultViewComponent =
    registry.resolve[listingViewDef.factories.view].component;

  const availableResultViews = [
    ...resultViews.filter(({ id }) => {
      const paramsPropId = `${id}ViewParams`;
      return Object.keys(appConfig).includes(paramsPropId)
        ? appConfig[paramsPropId].enabled
        : true;
    }),
  ];
  const [showFacets, setShowFacets] = useAtom(showFacetsAsideAtom);

  return (
    <>
      <div className="filter-bar">
        <Button
          className="show-filters"
          toggle
          active={showFacets}
          onClick={() => setShowFacets(!showFacets)}
        >
          Show filters
        </Button>
        <InlineFilterList />
      </div>

      <div className="above-results">
        <ViewSelectorWithLabel
          views={availableResultViews}
          active={activeViewId}
          onSetView={setActiveViewId}
        />
        <Sorting
          label={'Sort by '}
          sortOptions={sortOptions}
          view={SortingDropdownWithLabel}
        />
      </div>

      <AnswersList />
      <ResultViewComponent>{children}</ResultViewComponent>

      <div className="row">
        <div>
          <DownloadButton appConfig={appConfig} />
        </div>
        <div className="search-body-footer">
          <div></div>
          <Paging />
          <ResultsPerPage />
        </div>
      </div>
    </>
  );
};

export default FilterAsideContentView;
