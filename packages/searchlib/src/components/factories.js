import { getTermFilter } from '@eeacms/search/lib/search/filters';
import { getValueFacet } from '@eeacms/search/lib/search/facetValues';

export const buildRequest = (facet) => {
  return {
    [facet.field]: {
      terms: { field: facet.field },
    },
  };
};

export const suiFacet = ({
  field,
  label,
  filterType = 'any',
  isFilterable = false,
  ...params
}) => {
  return {
    field,
    factory: 'searchui.Facet',
    label: label || field,
    filterType,
    isFilterable,
    buildRequest,
    buildFilter: getTermFilter,
    getValue: getValueFacet,
    ...params,
  };
};
