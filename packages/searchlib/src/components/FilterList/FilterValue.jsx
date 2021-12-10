import React from 'react';
import { Component } from '@eeacms/search/components';
import { valueToString } from '@eeacms/search/lib/utils';

// TODO: use this in StringList, unify value display
const FilterValue = (props) => {
  const { value, field, appConfig } = props;
  const factoryName = appConfig.facets.find((facet) => facet.field === field)
    .filterListComponent;
  if (factoryName) {
    return <Component factoryName={factoryName} {...props} />;
  }

  return valueToString(value);
};

export default FilterValue;
