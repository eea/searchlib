"use strict";

var _interopRequireDefault = require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Header = exports.ListingViewDetails = void 0;

var _slicedToArray2 = _interopRequireDefault(require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray"));

var _react = _interopRequireDefault(require("react"));

var _semanticUiReact = require("semantic-ui-react");

var _appConfig = require("@eeacms/search/lib/hocs/appConfig");

var ListingViewDetails = function ListingViewDetails(props) {
  var _details$sections;

  var result = props.result,
      appConfig = props.appConfig;
  var listingViewParams = appConfig.listingViewParams;
  var details = listingViewParams.details;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "listing-view-details"
  }, (_details$sections = details.sections) === null || _details$sections === void 0 ? void 0 : _details$sections.map(function (section, index) {
    var _result$section$title, _section$fields;

    return /*#__PURE__*/_react.default.createElement("div", {
      className: "listing-view-details-section",
      key: index
    }, section.title ? /*#__PURE__*/_react.default.createElement("h4", null, section.title) : '', section.titleField ? /*#__PURE__*/_react.default.createElement("h5", null, (_result$section$title = result[section.titleField]) === null || _result$section$title === void 0 ? void 0 : _result$section$title.raw) : '', (_section$fields = section.fields) === null || _section$fields === void 0 ? void 0 : _section$fields.map(function (field, index) {
      var _result$field$field;

      return /*#__PURE__*/_react.default.createElement("div", {
        className: "details-field",
        key: index
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: "details-field-label"
      }, field.label || field.field), /*#__PURE__*/_react.default.createElement("div", {
        className: "details-field-value"
      }, (_result$field$field = result[field.field]) === null || _result$field$field === void 0 ? void 0 : _result$field$field.raw));
    }));
  }));
};

exports.ListingViewDetails = ListingViewDetails;

var Header = function Header(props) {
  var _result$urlField, _result$details$title;

  var _React$useState = _react.default.useState(false),
      _React$useState2 = (0, _slicedToArray2.default)(_React$useState, 2),
      showModal = _React$useState2[0],
      setShowModal = _React$useState2[1];

  var result = props.result,
      appConfig = props.appConfig;
  var listingViewParams = appConfig.listingViewParams;
  var details = listingViewParams.details;
  var _props$Level = props.Level,
      Level = _props$Level === void 0 ? 'h4' : _props$Level,
      urlField = props.urlField,
      titleField = props.titleField;
  var url = (_result$urlField = result[urlField]) === null || _result$urlField === void 0 ? void 0 : _result$urlField.raw;
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(Level, null, url ? /*#__PURE__*/_react.default.createElement("a", {
    href: result[urlField].raw
  }, result[titleField].raw) : /*#__PURE__*/_react.default.createElement(_semanticUiReact.Item.Header, {
    className: "listing-view-item",
    as: "a",
    onClick: function onClick() {
      return setShowModal(true);
    },
    onKeyDown: function onKeyDown() {
      return setShowModal(true);
    }
  }, result[titleField].raw)), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Modal, {
    open: showModal
  }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Modal.Header, null, details.titleField ? (_result$details$title = result[details.titleField]) === null || _result$details$title === void 0 ? void 0 : _result$details$title.raw : 'Details:'), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Modal.Content, null, /*#__PURE__*/_react.default.createElement(ListingViewDetails, {
    result: result,
    appConfig: appConfig
  })), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Modal.Actions, null, /*#__PURE__*/_react.default.createElement("button", {
    onClick: function onClick() {
      return setShowModal(false);
    }
  }, "Close"))));
}; // needed because of weird use of component from react-search-ui


exports.Header = Header;

var Inner = function Inner(props) {
  var _listingViewParams$ex;

  var result = props.result;

  var _useAppConfig = (0, _appConfig.useAppConfig)(),
      appConfig = _useAppConfig.appConfig;

  var listingViewParams = appConfig.listingViewParams; // console.log('appConfig', listingViewParams);

  return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Item, null, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Item.Content, null, /*#__PURE__*/_react.default.createElement(Header, Object.assign({}, props, listingViewParams, {
    appConfig: appConfig
  })), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Item.Extra, null, listingViewParams === null || listingViewParams === void 0 ? void 0 : (_listingViewParams$ex = listingViewParams.extraFields) === null || _listingViewParams$ex === void 0 ? void 0 : _listingViewParams$ex.map(function (_ref, i) {
    var field = _ref.field,
        label = _ref.label;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "simple-item-extra",
      key: i
    }, /*#__PURE__*/_react.default.createElement("em", null, label, ":"), " ", result[field].raw);
  }))));
};

var ResultItem = function ResultItem(props) {
  return /*#__PURE__*/_react.default.createElement(Inner, props);
};

var _default = ResultItem;
exports.default = _default;