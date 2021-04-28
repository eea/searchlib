import React from 'react';
import config from '@eeacms/search/registry';
import { useAppConfig } from '@eeacms/search/lib/hocs';

const Facets = (props) => {
  const appConfig = useAppConfig();
  const { facets = [] } = appConfig;
  return (
    <div className="facets">
      {facets.map((info, i) => {
        const { factory } = info;
        const FacetComponent = config.componentFactories[factory];
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
