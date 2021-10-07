import React from 'react';
import { useAppConfig } from '@eeacms/search/lib/hocs';

const Facets = ({ view, defaultWrapper }) => {
  const { appConfig, registry } = useAppConfig();
  const { facets = [] } = appConfig;
  const ViewComponent = view || registry.resolve['DefaultFacetsList'].component;
  return (
    <ViewComponent>
      {facets
        .filter((f) => f.showInFacetsList)
        .map((info, i) => {
          const { factory, wrapper } = info;
          const facet = registry.resolve[factory];
          const FacetComponent = facet.component;
          const WrapperComponent = wrapper
            ? registry.resolve[wrapper].component
            : defaultWrapper;
          const props = {
            ...info,
            ...info.params,
            ...facet,
          };
          return (
            <WrapperComponent
              key={i}
              {...props}
              field={info.field}
              view={(props) => <FacetComponent {...props} field={info.field} />}
            />
          );
        })}
    </ViewComponent>
  );
};

export default Facets;
