import React from 'react';

export default function GenericFacetWrapper({ view: ViewComponent, ...rest }) {
  return <ViewComponent {...rest} />;
}
