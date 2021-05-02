/**
 * Used by buildRequest to build the "filters" part of the ES request
 */
export default function buildRequestFilter(filters, config) {
  if (!filters) return;

  const facetFilters = Object.assign(
    {},
    ...config.facets.map((facet) => ({ [facet.field]: facet })),
  );

  filters = filters.reduce((acc, filter) => {
    if (Object.keys(facetFilters).includes(filter.field)) {
      return [...acc, facetFilters[filter.field].buildFilter(filter)];
    }

    // if (['acres', 'visitors'].includes(filter.field)) {
    //   return [...acc, getRangeFilter(filter)];
    // }

    return acc;
  }, []);

  if (filters.length < 1) return;
  return filters;
}
