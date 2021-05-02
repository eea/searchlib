const buildRequest = (facet) => {
  return {
    [facet.field]: {
      terms: { field: facet.field },
    },
  };
};

export const simpleFacet = ({
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
    params,
    buildRequest,
  };
};
