import registry from '@eeacms/search/registry';

const isFunction = (value) =>
  value &&
  (Object.prototype.toString.call(value) === '[object Function]' ||
    'function' === typeof value ||
    value instanceof Function);

/**
 * Construct the ES DSL filter query
 *
 * This will participate in the query part, filtering the result set.
 *
 */
export function buildRequestFilter(filters, config) {
  const boolFilters = (config.facets || []).reduce(
    (acc, facet) =>
      filters.find((filter) => filter.field === facet.field)
        ? [
            ...acc,
            {
              field: facet.field,
              values: [false],
            },
          ]
        : acc,
    [],
  );

  if (
    !(filters.length || config.permanentFilters?.length || boolFilters.length)
  )
    return;

  const facetsMap = Object.assign(
    {},
    ...config.facets?.map((facet) => {
      return { [facet.field]: registry.resolve[facet.factory] };
    }),
  );

  const appliedFilters = filters.reduce((acc, filter) => {
    if (Object.keys(facetsMap).includes(filter.field)) {
      const f = facetsMap[filter.field].buildFilter(filter, config);
      if (f) {
        return [...acc, f];
      }
    }

    if (Object.keys(config.filters).includes(filter.field)) {
      const { registryConfig } = config.filters[filter.field].factories;
      const { buildFilter } = registry.resolve[registryConfig];
      const f = buildFilter(filter, config);
      return [...acc, f];
    }

    return acc;
  }, []);

  const appliedFilterIds = appliedFilters.map((f) => f.field);

  // apply default values from configured filters;
  const appliedFiltersWithDefaults = config.facets.reduce((acc, facet) => {
    if (!appliedFilterIds.includes(facet.field) && facet.defaultValues) {
      const filterValue = facetsMap[facet.field].buildFilter(
        {
          ...facet,
          values: facet.defaultValues,
        },
        config,
      );
      if (filterValue) return [...acc, filterValue];
    }
    return acc;
  }, appliedFilters);

  (config.permanentFilters || []).forEach((f) =>
    appliedFiltersWithDefaults.push(isFunction(f) ? f() : f),
  );

  boolFilters.forEach((filter) =>
    appliedFiltersWithDefaults.push(
      facetsMap[filter.field].buildFilter(filter, config),
    ),
  );

  const res = appliedFiltersWithDefaults.length
    ? appliedFiltersWithDefaults.filter((f) => !!f)
    : null;

  console.log('final', res);
  return res;
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
              ...(filterValue.to && { to: filterValue.to }),
              ...(filterValue.to && { from: filterValue.from }),
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
              ...(filterValue.to && { to: filterValue.to }),
              ...(filterValue.to && { from: filterValue.from }),
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

export function getBooleanFilter(filter, config) {
  const facet = config.facets.find(({ field }) => field === filter.field);
  return filter.values[0] ? facet.on : facet.off;
}
