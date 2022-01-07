import React from 'react';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import { Component } from '@eeacms/search/components';
import GenericWrapper from './Wrappers/GenericWrapper';

const SecondaryFacetsList = ({ defaultWrapper = GenericWrapper, ...rest }) => {
  const { appConfig, registry } = useAppConfig();
  const { facets = [] } = appConfig;
  // console.log('facets', facets);
  return (
    <div className="secondary-facets">
      {facets
        .filter((f) => f.showInSecondaryFacetsList)
        .map((info, i) => {
          const { factory, wrapper } = info;

          const facetConfig = registry.resolve[factory];
          const FacetWrapperComponent = wrapper ? Component : defaultWrapper;

          const props = {
            ...info,
            ...info.params,
            // ...facet,
          };
          // console.log('secfac', info);
          const FacetComponent = facetConfig.component;

          return (
            <FacetWrapperComponent
              factoryName={wrapper}
              key={i}
              {...rest}
              {...props}
              field={info.field}
              view={FacetComponent}
            />
          );
        })}
    </div>
  );
};

export default SecondaryFacetsList;
