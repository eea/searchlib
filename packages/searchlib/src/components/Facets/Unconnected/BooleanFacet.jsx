import React from 'react';
import { Radio } from 'semantic-ui-react';

const truthy = (val) => {
  if (typeof val === 'string') {
    return val === 'true' ? true : false;
  }
  return val;
};

export const BooleanFacetComponent = (props) => {
  const {
    setFilter,
    filters,
    removeFilter,
    label,
    field,
    id,
    domProps = {},
  } = props;
  const filter = filters.find((filter) => filter.field === field);
  const value = filter ? truthy(filter.values[0]) : false;

  return (
    <div className="boolean-facet" {...domProps} id={id}>
      <Radio
        toggle
        label={label}
        checked={value}
        onChange={(e, { checked }) => {
          if (checked) {
            setFilter(field, checked, 'none');
          } else {
            removeFilter(field);
          }
        }}
      />
    </div>
  );
};

export default BooleanFacetComponent;
