/**
 * "Factory" methods. These are simple helpers that return configuration
 * objects for facet components
 */

export const histogramFacet = ({
  field,
  label,
  isFilterable = false,
  ...params
}) => {
  return {
    field,
    factory: 'HistogramFacet',
    label: label || field,
    height: 200, // default height of the histogram
    isFilterable,
    ...params,
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
    ...params,
  };
};

export const suiRangeFacet = ({
  field,
  label,
  filterType = 'any',
  isFilterable = false,
  ...params
}) => {
  return {
    field,
    factory: 'searchui.RangeFacet',
    label: label || field,
    filterType,
    isFilterable,
    ...params,
  };
};

export const multiTermFacet = ({
  field,
  label,
  // filterType = 'any',
  isFilterable = false,
  ...params
}) => {
  return {
    field,
    factory: 'MultiTermFacet',
    label: label || field,
    // filterType,
    isFilterable,
    ...params,
  };
};
