"use strict";

var _interopRequireDefault = require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildRequestFilter;

var _defineProperty2 = _interopRequireDefault(require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/toConsumableArray"));

/**
 * Used by buildRequest to build the "filters" part of the ES request
 */
function buildRequestFilter(filters, config) {
  if (!filters) return;
  var facetFilters = Object.assign.apply(Object, [{}].concat((0, _toConsumableArray2.default)(config.facets.map(function (facet) {
    return (0, _defineProperty2.default)({}, facet.field, facet);
  }))));
  filters = filters.reduce(function (acc, filter) {
    if (Object.keys(facetFilters).includes(filter.field)) {
      return [].concat((0, _toConsumableArray2.default)(acc), [facetFilters[filter.field].buildFilter(filter)]);
    }

    return acc;
  }, []);
  if (filters.length < 1) return;
  return filters;
}