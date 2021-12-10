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
  if (!(filters.length || config.permanentFilters?.length)) return;

  // a field:value map
  const _fieldToFilterValueMap = Object.assign(
    {},
    ...filters.map((filter) => ({ [filter.field]: filter })),
  );

  const _configuredFacets = Object.assign(
    {},
    ...config.facets?.map((facetConfig) => {
      return {
        [facetConfig.field]: {
          ...registry.resolve[facetConfig.factory],
          ...facetConfig,
          // value: registry.resolve[facetConfig.factory].buildFilter
        },
      };
    }),
  );

  const requestFilters = [
    ...Object.entries(_configuredFacets).map(([fieldName, facetConfig]) =>
      facetConfig.buildFilter(
        _fieldToFilterValueMap[fieldName] ??
          (facetConfig.defaultValue
            ? {
                field: fieldName,
                ...facetConfig.default,
              }
            : null),
        facetConfig,
      ),
    ),
    ...config.permanentFilters?.map((f) => (isFunction(f) ? f() : f)),
  ].filter((f) => !!f);

  console.log('requestFilters', requestFilters);
  return requestFilters;
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

  if (!filter) return;
  // console.log('termfilter', filter);

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
  if (!filter) return;

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

export function getBooleanFilter(filter, facetConfig) {
  const value = filter ? filter.values[0] : false;

  const res = value ? facetConfig.on : facetConfig.off;
  return res;
}
