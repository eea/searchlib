/**
 * "Factory" methods. These are simple helpers that return configuration
 * objects for facet components
 */

import { isFunction } from '@eeacms/search/utils';

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
    height: 100, // default height of the histogram
    showInFacetsList: true,
    rangeType: 'open',
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
    showInFacetsList: true,
    filterType,
    isFilterable,
    show: 10000,
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
    showInFacetsList: true,
    filterType,
    isFilterable,
    ...params,
  };
};

export const multiTermFacet = ({
  field,
  label,
  filterType = 'all',
  isFilterable = false,
  ...params
}) => {
  return {
    field,
    factory: 'MultiTermFacet',
    label: label || field,
    showInFacetsList: true,
    filterType,
    isFilterable,
    show: 10000,
    ...params,
  };
};

export const booleanFacet = (options) => {
  const { field, label, on, ...params } = isFunction(options)
    ? options()
    : options;

  return {
    field,
    label,
    on,
    factory: 'BooleanFacet',
    showInFacetsList: true,
    ...params,
  };
};

export const fixedRangeFacet = ({
  field,
  label,
  filterType = 'any',
  isFilterable = false,
  ...params
}) => {
  return {
    field,
    factory: 'FixedRangeFacet',
    label: label || field,
    showInFacetsList: true,
    filterType,
    isFilterable,
    ...params,
  };
};
