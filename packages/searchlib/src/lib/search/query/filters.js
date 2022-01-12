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
        [facetConfig.id || facetConfig.field]: {
          ...registry.resolve[facetConfig.factory],
          ...facetConfig,
        },
      };
    }),
  );

  const requestFilters = [
    ...Object.entries(_configuredFacets).map(([fieldName, facetConfig]) =>
      facetConfig.buildFilter(
        _fieldToFilterValueMap[facetConfig.field] ??
        (facetConfig.defaultValue
          ? {
            field: facetConfig.field,
            ...facetConfig.default,
          }
          : null),
        facetConfig,
      ),
    ),
    ...config.permanentFilters?.map((f) => (isFunction(f) ? f() : f)),
  ].filter((f) => !!f);

  // console.log(_configuredFacets, requestFilters);

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
  let exact = false;
  let filter_type = filter.type
  if (filter_type) {
    if (
      filter_type.split(',').length > 1 &&
      filter_type.split(',')[1] === 'exact'
    ) {
      exact = true;
    }
    filter_type = filter.type.split(',')[0];
  }
  console.log(filter_type);
  if (exact) {
    console.log(exact);
  }
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

const splitter_re = /(?<now>now)\s?(?<op>[\+|\-])\s?(?<count>\d+)(?<quantifier>\w)/;

const DAY = 86400000; // 1000 * 60 * 60 * 24

export function getDateRangeFilter(filter, filterConfig) {
  // Construct ES DSL query for range facets
  if (!filter) return;

  // should = "or", filter = "and"
  const minus = (x, y) => x - y;
  const plus = (x, y) => x + y;

  const toDays = (quantifier) =>
    quantifier === 'd'
      ? (x) => x * 1
      : quantifier === 'w'
        ? (x) => x * 7
        : quantifier === 'm'
          ? (x) => x * 30
          : quantifier === 'y'
            ? (x) => x * 365
            : (x) => x * 1;

  const toDate = (name) => {
    if (!name) return {};
    const now = new Date().getTime();
    if (name === 'now') return now;
    const match = name.match(splitter_re);
    let { op, count, quantifier } = match.groups;
    op = op === '-' ? minus : plus;
    const other = op(now, toDays(quantifier)(parseInt(count)) * DAY);
    return other;
    // const to = op === '-' ? other : now;
    // const from = op === '-' ? now : other;
    // return { to, from };
  };

  const toRangeFilter = (filterValue) => {
    const found = filterConfig.ranges.find((f) => f.key === filterValue);
    return found.to && found.from
      ? { to: toDate(found.to), from: toDate(found.from) }
      : {};
  };

  const res =
    filter.type === 'any'
      ? {
        bool: {
          should: filter.values.map((filterValue) => ({
            range: {
              [filter.field]: toRangeFilter(filterValue),
            },
          })),
          minimum_should_match: 1,
        },
      }
      : filter.type === 'all'
        ? {
          bool: {
            filter: filter.values.map((filterValue) => ({
              range: {
                [filter.field]: toRangeFilter(filterValue),
              },
            })),
          },
        }
        : {};

  // console.log('date range filter', { res, filter, filterConfig });

  return res;
}

export const getHistogramFilter = getRangeFilter;

export function getBooleanFilter(filter, facetConfig) {
  const value = filter ? filter.values[0] : false;

  const res = value ? facetConfig.on : facetConfig.off;
  return res;
}
