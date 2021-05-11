"use strict";

var _interopRequireDefault = require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoggedOut = exports.LoggedIn = exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Header = require("./Header");

var _default = {
  title: 'Example/Header',
  component: _Header.Header
};
exports.default = _default;

var Template = function Template(args) {
  return /*#__PURE__*/_react.default.createElement(_Header.Header, args);
};

var LoggedIn = Template.bind({});
exports.LoggedIn = LoggedIn;
LoggedIn.args = {
  user: {}
};
var LoggedOut = Template.bind({});
exports.LoggedOut = LoggedOut;
LoggedOut.args = {};