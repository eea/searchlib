"use strict";

var _interopRequireDefault = require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _semanticUiReact = require("semantic-ui-react");

var Filter = function Filter(props) {
  var field = props.field,
      type = props.type,
      values = props.values,
      onClear = props.onClear,
      removeFilter = props.removeFilter;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "filter-list-item"
  }, "".concat(field, " (").concat(type, "):"), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Label.Group, null, values === null || values === void 0 ? void 0 : values.map(function (v, index) {
    return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Label, {
      key: index
    }, v, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Icon, {
      onClick: function onClick() {
        return values.length === 1 ? onClear(field) : removeFilter(field, v, type);
      },
      name: "delete"
    }));
  })));
};

var FilterList = function FilterList(props) {
  var filters = props.filters,
      clearFilters = props.clearFilters,
      setFilter = props.setFilter,
      removeFilter = props.removeFilter;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "filter-list"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "filter-list-header"
  }, (filters === null || filters === void 0 ? void 0 : filters.length) ? /*#__PURE__*/_react.default.createElement(_semanticUiReact.Button, {
    compact: true,
    onClick: function onClick() {
      return clearFilters();
    }
  }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Icon, {
    name: "delete"
  }), "Clear filters") : ''), /*#__PURE__*/_react.default.createElement("div", {
    className: "filter-list-content"
  }, filters.map(function (filter, index) {
    return /*#__PURE__*/_react.default.createElement(Filter, Object.assign({
      key: index
    }, filter, {
      setFilter: setFilter,
      removeFilter: removeFilter,
      onClear: function onClear(field) {
        var activeFilters = filters.map(function (_ref) {
          var field = _ref.field;
          return field;
        });
        var exclude = activeFilters.filter(function (name) {
          return name !== field;
        });
        clearFilters(exclude);
      }
    }));
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "filter-list-footer"
  }));
};

var _default = FilterList;
exports.default = _default;