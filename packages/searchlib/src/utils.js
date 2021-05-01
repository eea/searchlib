import isFunction from 'lodash.isfunction';
import cloneDeep from 'lodash.clonedeep';
import mergeWith from 'lodash/mergeWith';

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
}

export function mergeConfig(object, ...sources) {
  return mergeWith(object, ...sources, customizer);
}
