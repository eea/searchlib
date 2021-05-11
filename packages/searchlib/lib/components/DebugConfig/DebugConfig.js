"use strict";

var _interopRequireDefault = require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray"));

var _react = _interopRequireDefault(require("react"));

var _semanticUiReact = require("semantic-ui-react");

var _hocs = require("@eeacms/search/lib/hocs");

var _reactJsonView = _interopRequireDefault(require("react-json-view"));

var DebugConfig = function DebugConfig(props) {
  var _React$useState = _react.default.useState(false),
      _React$useState2 = (0, _slicedToArray2.default)(_React$useState, 2),
      open = _React$useState2[0],
      setOpen = _React$useState2[1];

  var _useAppConfig = (0, _hocs.useAppConfig)(),
      appConfig = _useAppConfig.appConfig;

  return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Modal, {
    open: open,
    onClose: function onClose() {
      return setOpen(false);
    },
    onOpen: function onOpen() {
      return setOpen(true);
    },
    trigger: /*#__PURE__*/_react.default.createElement(_semanticUiReact.Button, {
      onClick: function onClick() {
        return setOpen(true);
      }
    }, "Debug config")
  }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Modal.Header, null, "Debug configuration"), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Modal.Content, null, /*#__PURE__*/_react.default.createElement(_reactJsonView.default, {
    src: appConfig
  })));
};

var _default = DebugConfig;
exports.default = _default;