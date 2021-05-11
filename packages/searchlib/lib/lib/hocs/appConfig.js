"use strict";

var _interopRequireDefault = require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withAppConfig = exports.useAppConfig = exports.AppConfigContext = void 0;

var _react = _interopRequireDefault(require("react"));

var AppConfigContext = /*#__PURE__*/_react.default.createContext(null);

exports.AppConfigContext = AppConfigContext;

var useAppConfig = function useAppConfig() {
  var context = _react.default.useContext(AppConfigContext);

  if (!context) {
    // eslint-disable-next-line no-console
    console.warn("The `useAppConfig` hook must be used inside the <AppConfigContext.Provider> component's context.");
  }

  return context;
};

exports.useAppConfig = useAppConfig;

var withAppConfig = function withAppConfig(WrappedComponent) {
  var WrappedField = function WrappedField(props) {
    var _useAppConfig = useAppConfig(),
        appConfig = _useAppConfig.appConfig,
        registry = _useAppConfig.registry;

    return /*#__PURE__*/_react.default.createElement(WrappedComponent, Object.assign({
      appConfig: appConfig,
      registry: registry
    }, props));
  };

  return WrappedField;
};

exports.withAppConfig = withAppConfig;