import React from 'react';
import { ResultsPerPage, Sorting } from '@elastic/react-search-ui'; // Paging
import Paging from './../Paging/Paging';
import ResultsPerPageSelector from './../ResultsPerPageSelector/ResultsPerPageSelector';
import {
  // ViewSelector,
  ViewSelectorWithLabel,
  FilterList,
  // SortingDropdown,
  SortingDropdownWithLabel,
  AnswerBox,
  DownloadButton,
} from '@eeacms/search/components';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import { useViews } from '@eeacms/search/lib/hocs';
import { checkInteracted } from './utils';

export const DefaultContentView = (props) => {
  const { appConfig, registry } = useAppConfig();
  const { children, filters, searchTerm } = props;
  const { activeViewId, setActiveViewId } = useViews();
  const { sortOptions, resultViews } = appConfig;

  const listingViewDef = resultViews.filter((v) => v.id === activeViewId)[0];
  const ResultViewComponent =
    registry.resolve[listingViewDef.factories.view].component;

  const wasInteracted = checkInteracted({ filters, searchTerm, appConfig });

  const availableResultViews = [
    ...resultViews.filter(({ id }) => {
      const paramsPropId = `${id}ViewParams`;
      return Object.keys(appConfig).includes(paramsPropId)
        ? appConfig[paramsPropId].enabled
        : true;
    }),
  ];

  return (
    <>
      <FilterList />
      {appConfig.enableNLP ? <AnswerBox /> : ''}
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
    </>
  );
};

export default DefaultContentView;
