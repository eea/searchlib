import registry from '@eeacms/search/registry';

/**
 * Construct the ES DSL filter query
 *
 * This will participate in the query part, filtering the result set.
 *
 */

export function buildRequestFilter(filters, config) {
  if (!filters) return;

  const facetsMap = Object.assign(
    {},
    ...config.facets.map((facet) => {
      return { [facet.field]: registry.resolve[facet.factory] };
    }),
  );

  const appliedFilters = [];

  filters = filters.reduce((acc, filter) => {
    if (Object.keys(facetsMap).includes(filter.field)) {
      const f = facetsMap[filter.field].buildFilter(filter);
      appliedFilters.push(filter.field);
      return [...acc, f];
    }

    if (Object.keys(config.filters).includes(filter.field)) {
      appliedFilters.push(filter.field);
      const { registryConfig } = config.filters[filter.field].factories;
      // console.log(registryConfig, registry.resolve[registryConfig]);
      const { buildFilter } = registry.resolve[registryConfig];
      const f = buildFilter(filter, config);
      // console.log(f, config);
      return [...acc, f];
    }

    return acc;
  }, []);

  // apply default values from configured filters;
  // console.log(config);
  config.facets.forEach((facet) => {
    if (!appliedFilters.includes(facet.field) && facet.defaultValues) {
      const filterValue = facetsMap[facet.field].buildFilter({
        ...facet,
        values: facet.defaultValues,
      });
      filters.push(filterValue);
    }
  });

  if (filters.length < 1) return;

  return filters;
}

export function getTermFilterValue(field, fieldValue) {
  // We do this because if the value is a boolean value, we need to apply
  // our filter differently. We're also only storing the string representation
  // of the boolean value, so we need to convert it to a Boolean.

  // TODO We need better approach for boolean values
  if (fieldValue === 'false' || fieldValue === 'true') {
    return { [field]: fieldValue === 'true' };
  }

  return { [`${field}`]: fieldValue };
}

export function getTermFilter(filter) {
  // Construct ES DSL query for term facets

  if (filter.type === 'any') {
    return {
      bool: {
        should: filter.values.map((filterValue) => ({
          term: getTermFilterValue(filter.field, filterValue),
        })),
        minimum_should_match: 1,
      },
    };
  } else if (filter.type === 'all') {
    return {
      bool: {
        filter: filter.values.map((filterValue) => ({
          term: getTermFilterValue(filter.field, filterValue),
        })),
      },
    };
  }
}

export function getRangeFilter(filter) {
  // Construct ES DSL query for range facets

  if (filter.type === 'any') {
    return {
      bool: {
        should: filter.values.map((filterValue) => ({
          range: {
            [filter.field]: {
              ...(filterValue.to && { lt: filterValue.to }),
              ...(filterValue.to && { gt: filterValue.from }),
            },
          },
        })),
        minimum_should_match: 1,
      },
    };
  } else if (filter.type === 'all') {
    return {
      bool: {
        filter: filter.values.map((filterValue) => ({
          range: {
            [filter.field]: {
              ...(filterValue.to && { lt: filterValue.to }),
              ...(filterValue.to && { gt: filterValue.from }),
            },
          },
        })),
      },
    };
  }
}

export function getHistogramFilter(filter) {
  return getRangeFilter(filter);
}

export function getBooleanFilter(filter) {
  //  debugger;
}
