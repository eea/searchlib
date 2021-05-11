"use strict";

var _interopRequireDefault = require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.buildRequest = void 0;

var _defineProperty2 = _interopRequireDefault(require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/defineProperty"));

var _reactSearchUi = require("@elastic/react-search-ui");

var _components = require("@eeacms/search/components");

var _ListingViewItem = _interopRequireDefault(require("@eeacms/search/components/Result/ListingViewItem"));

var _semanticUiReact = require("semantic-ui-react");

var _request = require("./lib/request");

var _filters = require("@eeacms/search/lib/search/filters");

var _facetValues = require("@eeacms/search/lib/search/facetValues");

var buildRequest = function buildRequest(facet) {
  return (0, _defineProperty2.default)({}, facet.field, {
    terms: {
      field: facet.field,
      size: 100000
    }
  });
};

exports.buildRequest = buildRequest;
var config = {
  resolve: {
    'searchui.Facet': {
      component: _reactSearchUi.Facet,
      buildRequest: buildRequest,
      buildFilter: _filters.getTermFilter,
      getValue: _facetValues.getValueFacet
    },
    'Item.Group': {
      component: _semanticUiReact.Item.Group
    },
    ListingViewItem: {
      component: _ListingViewItem.default
    },
    TableView: {
      component: _components.TableView
    },
    TableRowItem: {
      component: _components.TableRowItem
    },
    LeftColumnLayout: {
      component: _components.LeftColumnLayout
    }
  },
  searchui: {
    default: {
      // debug: true,
      hasA11yNotifications: true,
      onResultClick: _request.onResultClick,
      onAutocompleteResultClick: _request.onAutocompleteResultClick,
      onAutocomplete: _request.onAutocomplete,
      onSearch: _request.onSearch,
      // visually layout the search components (header, side, etc)
      layoutComponent: 'LeftColumnLayout',
      // when entering in search view, use this to search
      defaultSearchText: '',
      highlight: {
        fragment_size: 200,
        number_of_fragments: 1,
        fields: {}
      },
      facets: [],
      resultViews: [{
        id: 'listing',
        title: 'Items',
        icon: null,
        render: null,
        isDefault: true,
        factories: {
          view: 'Item.Group',
          item: 'ListingViewItem'
        }
      }, {
        id: 'table',
        title: 'Table',
        icon: null,
        render: null,
        isDefault: false,
        factories: {
          view: 'TableView',
          item: 'TableRowItem'
        }
      }],
      // parameters for the 'listing' Listing View
      // The config will lookup for `${id}ViewParams` objects
      listingViewParams: {
        enabled: true
      },
      tableViewParams: {
        enabled: true
      },
      sortOptions: [{
        name: 'Relevance',
        value: '',
        direction: ''
      }]
    }
  }
};

if (window) {
  window.searchUiConfig = config;
}

var _default = config;
exports.default = _default;