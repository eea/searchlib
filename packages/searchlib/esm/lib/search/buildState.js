"use strict";

var _interopRequireDefault = require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildState;

var _defineProperty2 = _interopRequireDefault(require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/defineProperty"));

var _objectSpread3 = _interopRequireDefault(require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectSpread2"));

var _slicedToArray2 = _interopRequireDefault(require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray"));

var _buildStateFacets = _interopRequireDefault(require("./buildStateFacets"));

function buildTotalPages(resultsPerPage, totalResults) {
  if (!resultsPerPage) return 0;
  if (totalResults === 0) return 1;
  return Math.ceil(totalResults / resultsPerPage);
}

function buildTotalResults(hits) {
  return hits.total;
}

function getHighlight(hit, fieldName) {
  // if (hit._source.title === 'Rocky Mountain' && fieldName === 'title') {
  //   window.hit = hit;
  //   window.fieldName = fieldName;
  // }
  if (!hit.highlight || !hit.highlight[fieldName] || hit.highlight[fieldName].length < 1) {
    return;
  }

  return hit.highlight[fieldName][0];
}

function buildResults(hits) {
  var addEachKeyValueToObject = function addEachKeyValueToObject(acc, _ref) {
    var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

    return (0, _objectSpread3.default)((0, _objectSpread3.default)({}, acc), {}, (0, _defineProperty2.default)({}, key, value));
  };

  var toObject = function toObject(value, snippet) {
    return (0, _objectSpread3.default)({
      raw: value
    }, snippet && {
      snippet: snippet
    });
  };

  return hits.map(function (record) {
    var rec = Object.entries(record._source).map(function (_ref3) {
      var _ref4 = (0, _slicedToArray2.default)(_ref3, 2),
          fieldName = _ref4[0],
          fieldValue = _ref4[1];

      return [fieldName, toObject(fieldValue, getHighlight(record, fieldName))];
    }).reduce(addEachKeyValueToObject, {});

    if (!Object.keys(rec).includes('id')) {
      rec.id = {
        raw: record._id
      }; // TODO: make sure to have ids
    }

    rec._original = record;
    return rec;
  });
}
/*
  Converts an Elasticsearch response to new application state

  When implementing an onSearch Handler in Search UI, the handler needs to
  convert search results into a new application state that Search UI
  understands.

  For instance, Elasticsearch returns "hits" for search results. This maps to
  the "results" property in application state, which requires a specific
  format. So this file iterates through "hits" and reformats them to "results"
  that Search UI understands.

  We do similar things for facets and totals.
*/


function buildState(response, resultsPerPage, config) {
  var results = buildResults(response.hits.hits);
  var totalResults = buildTotalResults(response.hits);
  var totalPages = buildTotalPages(resultsPerPage, totalResults);
  var facets = (0, _buildStateFacets.default)(response.aggregations, config); // console.log('response', results);

  return (0, _objectSpread3.default)({
    results: results,
    totalPages: totalPages,
    totalResults: totalResults
  }, facets && {
    facets: facets
  });
}