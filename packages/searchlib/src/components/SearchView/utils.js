import {
  getDefaultFilterValues,
  normalizedDefaultFilters,
  normalizeFilters,
  deepEqual,
} from '@eeacms/search/lib/utils';

export const checkInteracted = ({
  filters,
  searchedTerm,
  appConfig,
  wasSearched,
}) => {
  const normalizedDefaultFilters = getDefaultFilterValues(appConfig.facets);

  const normalizedFilters = normalizeFilters(filters);
  const filtersEqual = deepEqual(normalizedDefaultFilters, normalizedFilters);

  return wasSearched
    ? searchedTerm || !filtersEqual
    : !(filters.length === 0 || filtersEqual);
};
