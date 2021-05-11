"use strict";

var _interopRequireDefault = require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectSpread2"));

var _react = _interopRequireDefault(require("react"));

var _hocs = require("@eeacms/search/lib/hocs");

var Facets = function Facets(props) {
  var _useAppConfig = (0, _hocs.useAppConfig)(),
      appConfig = _useAppConfig.appConfig,
      registry = _useAppConfig.registry;

  var _appConfig$facets = appConfig.facets,
      facets = _appConfig$facets === void 0 ? [] : _appConfig$facets;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "facets"
  }, facets.map(function (info, i) {
    var factory = info.factory;
    var facet = registry.resolve[factory];
    var FacetComponent = facet.component;
    var props = (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, info), info.params), facet); // console.log('info', props);

    return /*#__PURE__*/_react.default.createElement(FacetComponent, Object.assign({
      key: i
    }, props));
  }));
};

var _default = Facets;
exports.default = _default;