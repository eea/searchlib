import React from 'react';
import { useAppConfig } from '@eeacms/search/lib/hocs';

const Facets = (props) => {
  const { appConfig, registry } = useAppConfig();
  const { facets = [] } = appConfig;
  return (
    <div className="facets">
      {facets.map((info, i) => {
        const { factory } = info;
        const facet = registry.resolve[factory];
        const FacetComponent = facet.component;
        const props = {
          ...info,
          ...info.params,
          ...facet,
        };
        // console.log('info', props);
        return <FacetComponent key={i} {...props} />;
      })}
    </div>
  );
};

export default Facets;
