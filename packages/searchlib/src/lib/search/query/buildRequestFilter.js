import registry from '@eeacms/search/registry';

/**
 * Used by buildRequest to build the "filters" part of the ES request
 */
export default function buildRequestFilter(filters, config) {
  if (!filters) return;

  const facetsMap = Object.assign(
    {},
    ...config.facets.map((facet) => {
      return { [facet.field]: registry.resolve[facet.factory] };
    }),
  );

  filters = filters.reduce((acc, filter) => {
    if (Object.keys(facetsMap).includes(filter.field)) {
      console.log('filter', filter);
      const f = facetsMap[filter.field].buildFilter(filter);
      return [...acc, f];
    }

    return acc;
  }, []);

  if (filters.length < 1) return;
  return filters;
}
