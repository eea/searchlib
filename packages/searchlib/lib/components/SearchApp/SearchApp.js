"use strict";

var _interopRequireDefault = require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SearchApp;

var _react = _interopRequireDefault(require("react"));

var _reactSearchUi = require("@elastic/react-search-ui");

var _hocs = require("@eeacms/search/lib/hocs");

var _components = require("@eeacms/search/components");

var _utils = require("@eeacms/search/lib/utils");

// import '@elastic/react-search-ui-views/lib/styles/styles.css';
function SearchApp(props) {
  var appName = props.appName,
      registry = props.registry;

  var appConfig = _react.default.useMemo(function () {
    return (0, _utils.applyConfigurationSchema)((0, _utils.rebind)(registry.searchui[appName]));
  }, [appName, registry]);

  appConfig.debug = props.debug;
  var appConfigContext = {
    appConfig: appConfig,
    registry: registry
  }; // console.log('appConfig', appConfig);

  return /*#__PURE__*/_react.default.createElement(_reactSearchUi.SearchProvider, {
    config: appConfig
  }, /*#__PURE__*/_react.default.createElement(_reactSearchUi.WithSearch, {
    mapContextToProps: function mapContextToProps(context) {
      return context;
    }
  }, function (params) {
    return /*#__PURE__*/_react.default.createElement(_hocs.AppConfigContext.Provider, {
      value: appConfigContext
    }, /*#__PURE__*/_react.default.createElement(_reactSearchUi.ErrorBoundary, null, /*#__PURE__*/_react.default.createElement(_components.SearchView, Object.assign({}, params, {
      appName: appName
    }))));
  }));
}