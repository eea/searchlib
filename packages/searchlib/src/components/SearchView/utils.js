export function deepEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      (areObjects && !deepEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }

  return true;
}

export function isObject(object) {
  return object != null && typeof object === 'object';
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

export const checkInteracted = ({
  filters,
  searchedTerm,
  appConfig,
  wasSearched,
}) => {
  const { defaultFilterValues = {} } = appConfig;
  const normalizedDefaultFilters = normalizeDefaultFilters(defaultFilterValues);
  const normalizedFilters = normalizeFilters(filters);
  const filtersEqual = deepEqual(normalizedDefaultFilters, normalizedFilters);

  return wasSearched
    ? searchedTerm || !filtersEqual
    : !(filters.length === 0 || filtersEqual);
};
