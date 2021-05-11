"use strict";

var _interopRequireDefault = require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildRequest;

var _objectSpread2 = _interopRequireDefault(require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectSpread2"));

var _toConsumableArray2 = _interopRequireDefault(require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/defineProperty"));

var _buildRequestFilter = _interopRequireDefault(require("./buildRequestFilter"));

var _registry = _interopRequireDefault(require("@eeacms/search/registry"));

function buildFrom(current, resultsPerPage) {
  if (!current || !resultsPerPage) return;
  return (current - 1) * resultsPerPage;
}

function buildSort(sortDirection, sortField) {
  if (sortDirection && sortField) {
    return [(0, _defineProperty2.default)({}, "".concat(sortField), sortDirection)];
  }
}

function buildMatch(searchTerm) {
  return searchTerm ? {
    multi_match: {
      query: searchTerm,
      fields: ['all_fields_for_freetext']
    }
  } : {
    match_all: {}
  };
}
/*

  Converts current application state to an Elasticsearch request.

  When implementing an onSearch Handler in Search UI, the handler needs to take
  the current state of the application and convert it to an API request.

  For instance, there is a "current" property in the application state that you
  receive in this handler. The "current" property represents the current page
  in pagination. This method converts our "current" property to Elasticsearch's
  "from" parameter.

  This "current" property is a "page" offset, while Elasticsearch's "from"
  parameter is a "item" offset. In other words, for a set of 100 results and
  a page size of 10, if our "current" value is "4", then the equivalent
  Elasticsearch "from" value would be "40". This method does that conversion.

  We then do similar things for searchTerm, filters, sort, etc.
*/


function buildRequest(state, config) {
  var current = state.current,
      filters = state.filters,
      resultsPerPage = state.resultsPerPage,
      searchTerm = state.searchTerm,
      sortDirection = state.sortDirection,
      sortField = state.sortField;
  var sort = buildSort(sortDirection, sortField);
  var match = buildMatch(searchTerm);
  var size = resultsPerPage;
  var from = buildFrom(current, resultsPerPage);
  var filter = (0, _buildRequestFilter.default)(filters, config); // console.log({ sort, match, size, from, filter, filters });

  var facets = config.facets;
  var aggregations = Object.assign.apply(Object, [{}].concat((0, _toConsumableArray2.default)(facets.map(function (facet) {
    var buildRequest = _registry.default.resolve[facet.factory].buildRequest;
    return buildRequest(facet);
  }))));
  var highlight = config.highlight;
  var body = (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({
    // Static query Configuration
    // --------------------------
    // https://www.elastic.co/guide/en/elasticsearch/reference/7.x/search-request-highlighting.html
    highlight: highlight,
    //https://www.elastic.co/guide/en/elasticsearch/reference/7.x/search-request-source-filtering.html#search-request-source-filtering
    // _source: [
    //   // 'id',
    //   // 'CodeCatalogue',
    //   // 'Descriptors',
    // ],
    aggs: (0, _objectSpread2.default)({}, aggregations),
    // Dynamic values based on current Search UI state
    // --------------------------
    // https://www.elastic.co/guide/en/elasticsearch/reference/7.x/full-text-queries.html
    query: {
      bool: (0, _objectSpread2.default)({
        must: [match]
      }, filter && {
        filter: filter
      })
    }
  }, sort && {
    sort: sort
  }), size && {
    size: size
  }), from && {
    from: from
  });
  return body;
}