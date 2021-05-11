"use strict";

var _interopRequireDefault = require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildStateFacets;

var _defineProperty2 = _interopRequireDefault(require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/toConsumableArray"));

var _registry = _interopRequireDefault(require("@eeacms/search/registry"));

function buildStateFacets(aggregations, config) {
  var facets = config.facets;
  var facetsMap = Object.assign.apply(Object, [{}].concat((0, _toConsumableArray2.default)(facets.map(function (facet) {
    return (0, _defineProperty2.default)({}, facet.field, _registry.default.resolve[facet.factory]);
  }))));
  var result = Object.assign.apply(Object, [{}].concat((0, _toConsumableArray2.default)(facets.map(function (facet) {
    var getValue = facetsMap[facet.field].getValue;
    var value = getValue(aggregations, facet.field);
    return value ? (0, _defineProperty2.default)({}, facet.field, value) : {};
  }))));

  if (Object.keys(result).length > 0) {
    return result;
  }
}