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
