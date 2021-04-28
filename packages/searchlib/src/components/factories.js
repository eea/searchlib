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
  };
};
