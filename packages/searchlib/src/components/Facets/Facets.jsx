import React from 'react';
import { useAppConfig } from '@eeacms/search/lib/hocs';

const Facets = (props) => {
  const { appConfig, registry } = useAppConfig();
  const { facets = [] } = appConfig;
  return (
    <div className="facets">
      {facets.map((info, i) => {
        const { factory } = info;
        const FacetComponent = registry.componentFactories[factory];
        const props = {
          ...info,
          ...info.params,
        };
        return <FacetComponent key={i} {...props} />;
      })}
    </div>
  );
};

export default Facets;
