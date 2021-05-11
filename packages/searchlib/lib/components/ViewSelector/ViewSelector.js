"use strict";

var _interopRequireDefault = require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _semanticUiReact = require("semantic-ui-react");

var ViewSelector = function ViewSelector(props) {
  var views = props.views,
      active = props.active,
      onSetView = props.onSetView;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "viewSelector"
  }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Button.Group, {
    compact: true
  }, views.map(function (view) {
    var Render = view.render,
        Icon = view.icon,
        title = view.title;
    return Render ? /*#__PURE__*/_react.default.createElement(Render, props) : /*#__PURE__*/_react.default.createElement(_semanticUiReact.Button, {
      key: view.id,
      active: view.id === active,
      onClick: function onClick() {
        return onSetView(view.id);
      }
    }, Icon ? /*#__PURE__*/_react.default.createElement(Icon, props) : title);
  })));
};

var _default = ViewSelector;
exports.default = _default;