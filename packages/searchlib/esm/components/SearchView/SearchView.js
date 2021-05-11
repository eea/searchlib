"use strict";

var _interopRequireDefault = require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.SearchView = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray"));

var _react = _interopRequireDefault(require("react"));

var _reactSearchUi = require("@elastic/react-search-ui");

var _components = require("@eeacms/search/components");

var _hocs = require("@eeacms/search/lib/hocs");

var _registry = _interopRequireDefault(require("@eeacms/search/registry"));

var SearchView = function SearchView(props) {
  var _resultViews$filter$;

  var wasSearched = props.wasSearched,
      setSearchTerm = props.setSearchTerm,
      appConfig = props.appConfig,
      appName = props.appName;
  var defaultSearchText = appConfig.defaultSearchText;

  _react.default.useEffect(function () {
    if (!wasSearched) {
      setSearchTerm(defaultSearchText);
    }
  }, [wasSearched, setSearchTerm, defaultSearchText]);

  var sortOptions = appConfig.sortOptions,
      resultViews = appConfig.resultViews;
  var defaultViewId = ((_resultViews$filter$ = resultViews.filter(function (v) {
    return v.isDefault;
  })[0]) === null || _resultViews$filter$ === void 0 ? void 0 : _resultViews$filter$.id) || 'listing';

  var _React$useState = _react.default.useState(defaultViewId),
      _React$useState2 = (0, _slicedToArray2.default)(_React$useState, 2),
      activeViewId = _React$useState2[0],
      setActiveViewId = _React$useState2[1];

  var listingViewDef = resultViews.filter(function (v) {
    return v.id === activeViewId;
  })[0]; // console.log(listingViewDef);

  var Item = _registry.default.resolve[listingViewDef.factories.item].component;
  var ResultViewComponent = _registry.default.resolve[listingViewDef.factories.view].component;
  var itemViewProps = listingViewDef.params;
  var Layout = _registry.default.resolve[appConfig.layoutComponent].component;
  var availableResultViews = (0, _toConsumableArray2.default)(resultViews.filter(function (_ref) {
    var id = _ref.id;
    return Object.keys(appConfig).includes("".concat(id, "ViewParams")) ? appConfig["".concat(id, "ViewParams")].enabled : true;
  })); // TODO: improve searchbox

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "searchapp searchapp-".concat(appName)
  }, /*#__PURE__*/_react.default.createElement(Layout, {
    header: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_reactSearchUi.SearchBox, {
      autocompleteMinimumCharacters: 3,
      autocompleteResults: {
        linkTarget: '_blank',
        sectionTitle: 'Results',
        titleField: 'Measure_name',
        urlField: 'CodeCatalogue',
        shouldTrackClickThrough: true,
        clickThroughTags: ['test']
      },
      autocompleteSuggestions: true
    }), appConfig.debug ? /*#__PURE__*/_react.default.createElement(_components.DebugConfig, null) : ''),
    sideContent: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_reactSearchUi.Sorting, {
      label: 'Sort by',
      sortOptions: sortOptions
    }), /*#__PURE__*/_react.default.createElement(_components.Facets, null)),
    bodyContent: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_components.FilterList, props), /*#__PURE__*/_react.default.createElement(_components.ViewSelector, {
      views: availableResultViews,
      active: activeViewId,
      onSetView: setActiveViewId
    }), /*#__PURE__*/_react.default.createElement(_reactSearchUi.Results, {
      shouldTrackClickThrough: true,
      view: function view(_ref2) {
        var children = _ref2.children;
        return /*#__PURE__*/_react.default.createElement(ResultViewComponent, null, children);
      },
      resultView: function resultView(props) {
        return /*#__PURE__*/_react.default.createElement(_reactSearchUi.Result, Object.assign({}, props, itemViewProps, {
          view: Item
        }));
      }
    })),
    bodyHeader: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_reactSearchUi.PagingInfo, null), /*#__PURE__*/_react.default.createElement(_reactSearchUi.ResultsPerPage, null)),
    bodyFooter: /*#__PURE__*/_react.default.createElement(_reactSearchUi.Paging, null)
  }));
};

exports.SearchView = SearchView;

var _default = (0, _hocs.withAppConfig)(SearchView);

exports.default = _default;