import isFunction from 'lodash.isfunction';
import cloneDeep from 'lodash.clonedeep';
import mergeWith from 'lodash/mergeWith';

export function isString(obj) {
  return typeof obj === 'string' || obj instanceof String;
}

export function isObject(obj) {
  return (
    obj instanceof Object &&
    !(obj instanceof Array) &&
    !(typeof obj === 'function')
  );
}

export function rebind(config) {
  if (!config) {
    // eslint-disable-next-line no-console
    console.error('Empty configuration!');
    return {};
  }
  let clone = cloneDeep(config);

  // rebinds functions to the "activated" config
  // TODO: does this need to called after mutating config?
  const self = {};
  return Object.assign(
    self,
    ...Object.keys(clone).map((name) => ({
      [name]: isFunction(config[name]) ? config[name].bind(self) : config[name],
    })),
  );
}

function customizer(objValue, srcValue) {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
  if (isObject(objValue) && isObject(srcValue)) {
    return { ...srcValue, ...objValue };
  }
  if (isString(objValue) || isString(srcValue)) {
    return objValue;
  }
  if (typeof objValue === 'boolean' || typeof srcValue === 'boolean') {
    return objValue;
  }
}

export function mergeConfig(object, ...sources) {
  let clone = cloneDeep(object);
  return mergeWith(clone, ...sources, customizer);
}

export function applyConfigurationSchema(config) {
  // based on partial configuration, it "finishes" the config with knowledge on
  // how to fill in the gaps
  config.disjunctiveFacets = [...(config.disjunctiveFacets || [])];
  const { facets = [] } = config;
  facets.forEach((facet) => {
    if (facet.isMulti && !config.disjunctiveFacets.includes(facet.field)) {
      config.disjunctiveFacets.push(facet.field);
    }
  });
  return config;
}

export function makeRange(options) {
  const {
    includeOutlierStart = true,
    includeOutlierEnd = true,
    normalRange,
    step = 1,
  } = options;
  const res = [];

  if (includeOutlierStart) res.push({ to: normalRange[0] - 1 });

  // TODO: check range increment (2010-2015, 2016-2020)
  for (
    let i = normalRange[0];
    i < normalRange[normalRange.length - 1];
    i += step
  ) {
    res.push({ from: i, to: i + step });
  }

  if (includeOutlierEnd)
    res.push({ from: normalRange[normalRange.length - 1] + 1 });

  return res;
}

export function getRangeStartEnd(ranges) {
  if (!ranges) return {};

  const start = ranges[0].from || ranges[0].to;
  const end = ranges[ranges.length - 1].to || ranges[ranges.length - 1].from;

  return { start, end };
}

export const normalizeDefaultFilters = (filters) => {
  let normalized = {};
  Object.keys(filters).forEach((key) => {
    normalized[key] = {
      type: filters[key].type,
      values: Array.isArray(filters[key].value)
        ? filters[key].value.sort()
        : [filters[key].value],
    };
  });
  return normalized;
};

export const normalizeFilters = (filters) => {
  let normalized = {};
  filters.forEach((filter) => {
    normalized[filter.field] = {
      type: filter.type,
      values: Array.isArray(filter.values)
        ? filter.values.sort()
        : [filter.values],
    };
  });
  return normalized;
};

export const getDefaultFilterValues = (facets) => {
  const defaultFilterValues = facets.reduce(
    (acc, facet) =>
      facet.default ? [...acc, { field: facet.field, ...facet.default }] : acc,
    [],
  );
  return normalizeDefaultFilters(defaultFilterValues);
};

function _isObject(object) {
  // TODO: don't use this one, use isObject
  return object != null && typeof object === 'object';
}

export function deepEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = _isObject(val1) && _isObject(val2);
    if (
      (areObjects && !deepEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }

  return true;
}

export function valueToString(value) {
  switch (typeof value) {
    case 'string':
      return value;
    case 'object':
      if (value.type === 'range') {
        return `${valueToString(value.from)} - ${valueToString(value.to)}`;
      }
      if (value.rangeType === 'fixed') {
        return valueToString(value.name);
      }
      break;
    case 'boolean':
      return value;
    case 'number':
      return value.toString();
    case 'undefined':
      return '';
    default:
      break;
  }

  // eslint-disable-next-line no-console
  console.warn('Unknown value type', value, typeof value);

  return value.toString();
}

export function getFilterValueDisplay(filterValue) {
  if (filterValue === undefined || filterValue === null) return '';
  if (filterValue.hasOwnProperty('name')) return filterValue.name;
  return String(filterValue);
}

export function getTermDisplayValue({ vocab, term, field }) {
  const base = getFilterValueDisplay(term);
  return vocab[field]?.[base] || base;
}

export const firstWords = (text, wordsNumber) => {
  text = text || '';
  const suffix = ' ...';
  const words = text.split(' ');
  if (words.length > wordsNumber) {
    return words.slice(0, wordsNumber).join(' ') + suffix;
  } else {
    return text;
  }
};

export const firstChars = (text, charsNumber) => {
  text = text || '';
  const suffix = ' ...';
  if (text.length > charsNumber) {
    return text.substring(0, charsNumber) + suffix;
  } else {
    return text;
  }
};

export const hasAppliedCustomFilters = (filters, appConfig) => {
  const mainFacetFields = appConfig.facets
    .filter((f) => f.showInFacetsList ?? true)
    .map((f) => f.field);
  const mainFacets = appConfig.facets.filter((f) =>
    mainFacetFields.includes(f.field),
  );
  const mainFilters = filters.filter((f) => mainFacetFields.includes(f.field));
  const normalizedDefaultFilters = getDefaultFilterValues(mainFacets);
  const normalizedFilters = normalizeDefaultFilters(mainFilters);
  const filtersEqual = deepEqual(normalizedDefaultFilters, normalizedFilters);

  return !filtersEqual;
};

export const customOrder = (values, facetValues, sortOrder = 'ascending') => {
  // values: [{value: 'en', count: 20141}, ...]
  // facetValues: ['sq', 'bg', ...]
  // Return values ordered as in facetValues
  let result = [];
  for (let value of facetValues) {
    let item = values.filter((c) => c.value === value)[0];
    if (item !== undefined) {
      result.push(item);
    }
  }

  if (sortOrder === 'descending') {
    return result.reverse();
  }

  return result;
};
