import React from 'react';
import { useAppConfig } from '@eeacms/search/lib/hocs';

const Facets = (props) => {
  const { appConfig, registry } = useAppConfig();
  const { facets = [] } = appConfig;
  // console.log(appConfig['facetsListComponent'] || 'DefaultFacetsList');
  const Component =
    registry.resolve[appConfig['facetsListComponent'] || 'DefaultFacetsList']
      .component;
  return (
    <Component>
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
    </Component>
  );
};

export default Facets;
