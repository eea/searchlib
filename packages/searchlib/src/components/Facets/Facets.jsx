import React from 'react';
import { useAppConfig } from '@eeacms/search/lib/hocs';

const Facets = (props) => {
  const { appConfig, registry } = useAppConfig();
  const { facets = [] } = appConfig;
  return (
    <div className="facets">
      {facets
        .filter((f) => f.showInFacetsList)
        .map((info, i) => {
          const { factory, wrapper = 'AccordionFacetWrapper' } = info;
          const facet = registry.resolve[factory];
          const FacetComponent = facet.component;
          const WrapperComponent = registry.resolve[wrapper].component;
          const props = {
            ...info,
            ...info.params,
            ...facet,
          };
          return (
            <WrapperComponent
              key={i}
              {...props}
              view={(props) => <FacetComponent {...props} />}
            />
          );
        })}
    </div>
  );
};

export default Facets;
