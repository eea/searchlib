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
  // if (isString(objValue) || isString(srcValue)) {
  //   console.log('string', objValue, srcValue);
  // }
}

export function mergeConfig(object, ...sources) {
  let clone = cloneDeep(object);
  return mergeWith(clone, ...sources, customizer);
}

export function applyConfigurationSchema(config) {
  // based on partial configuration, it "finishes" the config with knowledge on
  // how to fill in the gaps
  config.disjunctiveFacets = [...(config.disjunctiveFacets || [])];
  config.facets?.forEach((facet) => {
    if (facet.isMulti && !config.disjunctiveFacets.includes(facet.field)) {
      config.disjunctiveFacets.push(facet.field);
    }
  });
  return config;
}
