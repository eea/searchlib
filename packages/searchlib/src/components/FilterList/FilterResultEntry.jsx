import React from 'react';
import { Icon } from 'semantic-ui-react';
import { useAtom } from 'jotai';
import { moreLikeThisAtom } from '@eeacms/search/state';

const FilterResultEntry = (props) => {
  const { value } = props;
  const [result] = useAtom(moreLikeThisAtom);
  console.log('filter result', result);
  if (result) {
    return (
      <a href={value} target="_blank" rel="noreferrer">
        <Icon name="external" size="small" />
        {value}
      </a>
    );
  }
  return value;
};

export default FilterResultEntry;
