import isFunction from 'lodash.isfunction';
import cloneDeep from 'lodash.clonedeep';

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
