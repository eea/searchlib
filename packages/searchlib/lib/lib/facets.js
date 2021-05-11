"use strict";

var _interopRequireDefault = require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.suiFacet = void 0;

var _objectSpread2 = _interopRequireDefault(require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectSpread2"));

var _objectWithoutProperties2 = _interopRequireDefault(require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties"));

var suiFacet = function suiFacet(_ref) {
  var field = _ref.field,
      label = _ref.label,
      _ref$filterType = _ref.filterType,
      filterType = _ref$filterType === void 0 ? 'any' : _ref$filterType,
      _ref$isFilterable = _ref.isFilterable,
      isFilterable = _ref$isFilterable === void 0 ? false : _ref$isFilterable,
      params = (0, _objectWithoutProperties2.default)(_ref, ["field", "label", "filterType", "isFilterable"]);
  return (0, _objectSpread2.default)({
    field: field,
    factory: 'searchui.Facet',
    label: label || field,
    filterType: filterType,
    isFilterable: isFilterable
  }, params);
};

exports.suiFacet = suiFacet;