import React from 'react';
import { Icon } from 'semantic-ui-react';

const FilterResultEntry = (props) => {
  const { value } = props;
  return (
    <a href={value} target="_blank" rel="noreferrer">
      <Icon name="external" size="small" />
      {value}
    </a>
  );
};

export default FilterResultEntry;
