import React from 'react';
import registry from '@eeacms/search/registry';
import { Results, Result } from '@elastic/react-search-ui';

export const BodyContent = (props) => {
  const { appConfig, wasInteracted } = props;
  const { resultViews } = appConfig;

  const defaultViewId =
    resultViews.filter((v) => v.isDefault)[0]?.id || 'listing';
  const [activeViewId, setActiveViewId] = React.useState(defaultViewId);

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
              <ContentBodyView>{children}</ContentBodyView>
            ) : (
              <NoResultsComponent {...props} />
            )
          ) : (
            <ContentBodyView
              {...props}
              setActiveViewId={setActiveViewId}
              activeViewId={activeViewId}
            >
              {children}
            </ContentBodyView>
          )
        ) : InitialViewComponent ? (
          <InitialViewComponent {...props} />
        ) : (
          <ContentBodyView>{children}</ContentBodyView>
        );
      }}
      resultView={(props) => (
        <Result {...props} {...itemViewProps} view={Item} />
      )}
    />
  );
};
