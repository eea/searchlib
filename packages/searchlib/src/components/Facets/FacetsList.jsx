import React from 'react';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import { Component } from '@eeacms/search/components';

const FacetsList = ({ view, defaultWrapper }) => {
  const { appConfig } = useAppConfig();
  const { facets = [] } = appConfig;
  const ViewComponent = view || Component;
  return (
    <ViewComponent name="DefaultFacetsList">
      {facets
        .filter((f) => f.showInFacetsList)
        .map((info, i) => {
          const { factory, wrapper } = info;
          // const facet = registry.resolve[factory];
          const FacetWrapperComponent = wrapper ? Component : defaultWrapper;
          const props = {
            ...info,
            ...info.params,
            // ...facet,
          };
          return (
            <FacetWrapperComponent
              factoryName={wrapper}
              key={i}
              {...props}
              field={info.field}
              view={(props) => (
                <Component
                  factoryName={factory}
                  {...props}
                  field={info.field}
                />
              )}
            />
          );
        })}
    </ViewComponent>
  );
};

export default FacetsList;
