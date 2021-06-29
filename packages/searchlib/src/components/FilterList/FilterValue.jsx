import React from 'react';

const FilterValue = (props) => {
  const { value, field, appConfig, registry } = props;
  const factoryName = appConfig.filters[field]?.factories?.filterList;
  if (factoryName) {
    const Component = registry.resolve[factoryName].component;
    return <Component {...props} />;
  }

  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    if (value.type === 'range') {
      return `${value.from} - ${value.to}`;
    }
    if (value.rangeType === 'fixed') {
      return `${value.name}`;
    }
  }

  // eslint-disable-next-line no-console
  console.warn('Unknown value type', value);

  return value.toString();
};

export default FilterValue;
