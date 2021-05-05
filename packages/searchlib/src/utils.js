import isFunction from 'lodash.isfunction';
import cloneDeep from 'lodash.clonedeep';
import mergeWith from 'lodash/mergeWith';

export function isString(obj) {
  return typeof obj === 'string' || obj instanceof String;
}

export function rebind(config) {
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
  config.facets.forEach((facet) => {
    if (facet.isMulti && !config.disjunctiveFacets.includes(facet.field)) {
      config.disjunctiveFacets.push(facet.field);
    }
  });
  return config;
}

/**
 * Recursively "resolve" factories in the appConfig based on info in registry
 */
export function injectFactories(appConfig, registry) {
  const traverse = (obj) => {
    const type = Array.isArray(obj) ? 'array' : typeof obj;

    switch (type) {
      case 'string':
        return registry[obj];
      case 'array':
        return obj.map(traverse);
      default:
        return Object.keys(obj).includes('factory')
          ? { ...obj, factory: registry[obj.factory] }
          : {
              ...obj,
              ...(obj.factories && {
                factories: Object.assign(
                  {},
                  ...Object.keys(obj.factories).map((name) => ({
                    [name]: registry[name],
                  })),
                ),
              }),
            };
    }
  };

  // const traverse = (obj) => {
  //   for (let k in obj) {
  //     if (obj[k] && typeof obj[k] === 'object') {
  //       traverse(obj[k]);
  //     } else {
  //       obj[k] = resolver(obj);
  //     }
  //   }
  // };

  return traverse(appConfig);
}
