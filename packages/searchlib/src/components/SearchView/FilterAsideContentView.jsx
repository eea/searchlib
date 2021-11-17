import React from 'react';
import { ResultsPerPage, Paging, Sorting } from '@elastic/react-search-ui';
import {
  ViewSelectorWithLabel,
  SortingDropdownWithLabel,
  PagingInfo,
  DownloadButton,
} from '@eeacms/search/components';
import { SectionTabs } from '@eeacms/search/components';
import { checkInteracted } from './utils';
import { PagingInfo as SUIPagingInfo } from '@elastic/react-search-ui';
import { useViews } from '@eeacms/search/lib/hocs';

import registry from '@eeacms/search/registry';

export const FilterAsideContentView = (props) => {
  const { appConfig, children, filters, searchTerm } = props;
  const { sortOptions, resultViews } = appConfig;
  const { activeViewId, setActiveViewId } = useViews();

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

  const wasInteracted = checkInteracted({ filters, searchTerm, appConfig });

  return (
    <>
      <SectionTabs />

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

      <ResultViewComponent>{children}</ResultViewComponent>

      <div className="row">
        <div className="search-body-footer">
          <div>
            {wasInteracted ? <SUIPagingInfo view={PagingInfo} /> : null}
          </div>
          <Paging />
          <ResultsPerPage />
          <div>
            <DownloadButton appConfig={appConfig} />
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterAsideContentView;
