import React from 'react';
import {
  ResultsPerPage,
  Paging,
  Sorting,
  PagingInfo as SUIPagingInfo,
} from '@elastic/react-search-ui';
import {
  ViewSelector,
  FilterList,
  SortingDropdown,
  AnswersList,
  DownloadButton,
} from '@eeacms/search/components';
import { useAppConfig } from '@eeacms/search/lib/hocs';

export const DefaultContentView = (props) => {
  const { appConfig, registry } = useAppConfig();
  const { activeViewId, setActiveViewId, children } = props;
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

  return (
    <>
      <FilterList />
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

export default DefaultContentView;
