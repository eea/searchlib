import React from 'react';
import { useAppConfig } from '@eeacms/search/lib/hocs';

function getFilterValueDisplay(filterValue) {
  if (filterValue === undefined || filterValue === null) return '';
  if (filterValue.hasOwnProperty('name')) return filterValue.name;
  return String(filterValue);
}

const Term = (props) => {
  const { term, field } = props;
  const { appConfig } = useAppConfig();
  const { vocab = {} } = appConfig;
  const base = getFilterValueDisplay(term);
  return vocab[field]?.[base] || base;
};

export default Term;
