import React from 'react';

// TODO: use this in StringList, unify value display
function valueToString(value) {
  switch (typeof value) {
    case 'string':
      return value;
    case 'object':
      if (value.type === 'range') {
        return `${valueToString(value.from)} - ${valueToString(value.to)}`;
      }
      if (value.rangeType === 'fixed') {
        return valueToString(value.name);
      }
      break;
    case 'boolean':
      return value;
    case 'undefined':
      return '';
    default:
      break;
  }

  // eslint-disable-next-line no-console
  console.warn('Unknown value type', value);

  return value.toString();
}

const FilterValue = (props) => {
  const { value, field, appConfig, registry } = props;
  const factoryName = appConfig.filters[field]?.factories?.filterList;
  if (factoryName) {
    const Component = registry.resolve[factoryName].component;
    return <Component {...props} />;
  }

  return valueToString(value);
};

export default FilterValue;
