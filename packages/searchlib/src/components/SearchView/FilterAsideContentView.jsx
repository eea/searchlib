import React from 'react';
import { ResultsPerPage, Paging as OldPaging, Sorting } from '@elastic/react-search-ui';
import Paging from './../Paging/Paging';
import {
  ViewSelectorWithLabel,
  SortingDropdownWithLabel,
  PagingInfo,
  DownloadButton,
} from '@eeacms/search/components';
import PagingPrevNext from './../PagingInfo/PagingPrevNext';
import { SectionTabs } from '@eeacms/search/components';
import { checkInteracted } from './utils';
import { PagingInfo as SUIPagingInfo } from '@elastic/react-search-ui';
import { useViews } from '@eeacms/search/lib/hocs';

import registry from '@eeacms/search/registry';
import { AnswerBox, Component } from '@eeacms/search/components';

export const FilterAsideContentView = (props) => {
  const { appConfig, children, filters, searchTerm, current } = props;
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
  const useNewPaging = false; // WIP - use true to activate new paging

  const layoutMode = activeViewId === 'horizontalCard' ? 'fixed' : 'fullwidth';

  return (
    <>
      <SectionTabs />

      <div className={`results-layout ${layoutMode}`}>
        <div className="above-results">
          <Component factoryName="SecondaryFacetsList" {...props} />
          <Sorting
            label={'Sort by '}
            sortOptions={sortOptions}
            view={SortingDropdownWithLabel}
          />
          <ViewSelectorWithLabel
            views={availableResultViews}
            active={activeViewId}
            onSetView={setActiveViewId}
          />
        </div>

        {current === 1 ? <AnswerBox /> : ''}

        <ResultViewComponent>{children}</ResultViewComponent>

        <div className="row">
          <div className="test-new-paging">
            {wasInteracted && useNewPaging ? (
              <>
                <Paging />
              </>
            ) : null}
          </div>

          <div className="search-body-footer">
            <div>
              {wasInteracted ? <SUIPagingInfo view={PagingInfo} /> : null}
            </div>
            <OldPaging />
            <ResultsPerPage />
            <div>
              <DownloadButton appConfig={appConfig} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterAsideContentView;
