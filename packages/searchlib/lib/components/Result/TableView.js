"use strict";

var _interopRequireDefault = require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _semanticUiReact = require("semantic-ui-react");

var _react = _interopRequireDefault(require("react"));

var _hocs = require("@eeacms/search/lib/hocs");

var WrappedTable = function WrappedTable(props) {
  var _useAppConfig = (0, _hocs.useAppConfig)(),
      appConfig = _useAppConfig.appConfig;

  var tableViewParams = appConfig.tableViewParams;
  return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Table, {
    celled: true,
    compact: true
  }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Table.Header, null, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Table.Row, null, tableViewParams.columns.map(function (col, index) {
    return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Table.HeaderCell, {
      key: index
    }, col.title || col.field);
  }))), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Table.Body, null, props.children));
};

var TableView = function TableView(props) {
  return /*#__PURE__*/_react.default.createElement(WrappedTable, props);
};

var _default = TableView;
exports.default = _default;