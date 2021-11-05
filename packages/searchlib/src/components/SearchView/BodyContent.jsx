import React from 'react';
import registry from '@eeacms/search/registry';
import { Results, Result } from '@elastic/react-search-ui';
import { useViews } from '@eeacms/search/lib/hocs';

export const BodyContent = (props) => {
  const { appConfig, wasInteracted } = props;
  const { resultViews } = appConfig;
  const { activeViewId } = useViews();

  const itemViewProps = appConfig[`${activeViewId}ViewParams`];
  const listingViewDef = resultViews.filter((v) => v.id === activeViewId)[0];

  const Item = registry.resolve[listingViewDef.factories.item].component;

  const NoResultsComponent =
    appConfig.noResultsView?.factory &&
    registry.resolve[appConfig.noResultsView?.factory].component;

  const ContentBodyView =
    registry.resolve[appConfig['contentBodyComponent'] || 'DefaultContentView']
      .component;

  const InitialViewComponent =
    appConfig.initialView?.factory &&
    registry.resolve[appConfig.initialView.factory].component;

  return (
    <Results
      shouldTrackClickThrough={true}
      view={({ children }) => {
        return wasInteracted ? (
          NoResultsComponent ? (
            children ? (
              <ContentBodyView {...props}>{children}</ContentBodyView>
            ) : (
              <NoResultsComponent {...props} />
            )
          ) : (
            <ContentBodyView {...props}>{children}</ContentBodyView>
          )
        ) : InitialViewComponent ? (
          <InitialViewComponent {...props} />
        ) : (
          <ContentBodyView {...props}>{children}</ContentBodyView>
        );
      }}
      resultView={(props) => (
        <Result {...props} {...itemViewProps} view={Item} />
      )}
    />
  );
};
