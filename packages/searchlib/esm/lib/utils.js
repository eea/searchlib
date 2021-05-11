"use strict";

var _interopRequireDefault = require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isString = isString;
exports.rebind = rebind;
exports.mergeConfig = mergeConfig;
exports.applyConfigurationSchema = applyConfigurationSchema;

var _defineProperty2 = _interopRequireDefault(require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/toConsumableArray"));

var _lodash = _interopRequireDefault(require("lodash.isfunction"));

var _lodash2 = _interopRequireDefault(require("lodash.clonedeep"));

var _mergeWith = _interopRequireDefault(require("lodash/mergeWith"));

function isString(obj) {
  return typeof obj === 'string' || obj instanceof String;
}

function rebind(config) {
  var clone = (0, _lodash2.default)(config); // rebinds functions to the "activated" config

  var self = {};
  return Object.assign.apply(Object, [self].concat((0, _toConsumableArray2.default)(Object.keys(clone).map(function (name) {
    return (0, _defineProperty2.default)({}, name, (0, _lodash.default)(config[name]) ? config[name].bind(self) : config[name]);
  }))));
}

function customizer(objValue, srcValue) {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  } // if (isString(objValue) || isString(srcValue)) {
  //   console.log('string', objValue, srcValue);
  // }

}

function mergeConfig(object) {
  var clone = (0, _lodash2.default)(object);

  for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    sources[_key - 1] = arguments[_key];
  }

  return _mergeWith.default.apply(void 0, [clone].concat(sources, [customizer]));
}

function applyConfigurationSchema(config) {
  // based on partial configuration, it "finishes" the config with knowledge on
  // how to fill in the gaps
  config.disjunctiveFacets = (0, _toConsumableArray2.default)(config.disjunctiveFacets || []);
  config.facets.forEach(function (facet) {
    if (facet.isMulti && !config.disjunctiveFacets.includes(facet.field)) {
      config.disjunctiveFacets.push(facet.field);
    }
  });
  return config;
}