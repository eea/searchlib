import React from 'react';
import { Sorting } from '@elastic/react-search-ui';
import ResultsPerPageSelector from './../ResultsPerPageSelector/ResultsPerPageSelector';
import Paging from './../Paging/Paging';
import {
  ViewSelectorWithLabel,
  SortingDropdownWithLabel,
  DownloadButton,
} from '@eeacms/search/components';
import { SectionTabs } from '@eeacms/search/components';
import { checkInteracted } from './utils';
import { useViews } from '@eeacms/search/lib/hocs';

import registry from '@eeacms/search/registry';
import { AnswerBox, Component } from '@eeacms/search/components';
import { NoResults } from '@eeacms/search/components/Result/NoResults';
import { useSearchContext } from '@eeacms/search/lib/hocs';

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
  const layoutMode = activeViewId === 'horizontalCard' ? 'fixed' : 'fullwidth';

  const { isLoading, wasSearched } = useSearchContext();
  return (
    <>
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

          {children.length === 0 && !isLoading && wasSearched && <NoResults />}

          {current === 1 ? <AnswerBox /> : ''}

          {<ResultViewComponent>{children}</ResultViewComponent>}

          {children.length > 0 && (
            <div className="row">
              <div className="search-body-footer">
                <div className="prev-next-paging">
                  {wasInteracted ? (
                    <>
                      <Paging />
                    </>
                  ) : null}
                </div>
                <ResultsPerPageSelector />
                <div>
                  <DownloadButton appConfig={appConfig} />
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    </>
  );
};

export default FilterAsideContentView;
