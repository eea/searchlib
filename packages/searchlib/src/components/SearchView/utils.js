import {
  getDefaultFilterValues,
  normalizeFilters,
  deepEqual,
} from '@eeacms/search/lib/utils';

export const checkInteracted = ({
  filters,
  searchTerm,
  appConfig,
  wasSearched,
}) => {
  const normalizedDefaultFilters = getDefaultFilterValues(appConfig.facets);

  const normalizedFilters = normalizeFilters(filters);
  const filtersEqual = deepEqual(normalizedDefaultFilters, normalizedFilters);

  return wasSearched
    ? searchTerm || !filtersEqual
    : searchTerm || !(filters.length === 0 || filtersEqual);
};
