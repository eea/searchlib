"use strict";

var _interopRequireDefault = require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _hocs = require("@eeacms/search/lib/hocs");

var _semanticUiReact = require("semantic-ui-react");

var WrappedRowItem = function WrappedRowItem(props) {
  var _useAppConfig = (0, _hocs.useAppConfig)(),
      appConfig = _useAppConfig.appConfig;

  var tableViewParams = appConfig.tableViewParams;
  var result = props.result;
  return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Table.Row, null, tableViewParams.columns.map(function (col, index) {
    return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Table.Cell, {
      key: index
    }, result[col.field].raw);
  }));
};

var TableRowItem = function TableRowItem(props) {
  return /*#__PURE__*/_react.default.createElement(WrappedRowItem, props);
};

var _default = TableRowItem;
exports.default = _default;