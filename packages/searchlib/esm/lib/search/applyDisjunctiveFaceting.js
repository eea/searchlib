"use strict";

var _interopRequireDefault = require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = applyDisjunctiveFaceting;

var _regenerator = _interopRequireDefault(require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/defineProperty"));

var _objectSpread2 = _interopRequireDefault(require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectSpread2"));

var _runRequest = _interopRequireDefault(require("./runRequest"));

var _buildRequest = _interopRequireDefault(require("./buildRequest"));

function combineAggregationsFromResponses(responses) {
  return responses.reduce(function (acc, response) {
    return (0, _objectSpread2.default)((0, _objectSpread2.default)({}, acc), response.body.aggregations);
  }, {});
} // To calculate a disjunctive facet correctly, you need to calculate the facet
// counts as if the filter was not applied. If you did not do this, list of
// facet values would collapse to just one value, which is whatever you have
// filtered on in that facet.


function removeFilterByName(state, facetName) {
  return (0, _objectSpread2.default)((0, _objectSpread2.default)({}, state), {}, {
    filters: state.filters.filter(function (f) {
      return f.field !== facetName;
    })
  });
}

function removeAllFacetsExcept(body, facetName) {
  return (0, _objectSpread2.default)((0, _objectSpread2.default)({}, body), {}, {
    aggs: (0, _defineProperty2.default)({}, facetName, body.aggs[facetName])
  });
}

function changeSizeToZero(body) {
  return (0, _objectSpread2.default)((0, _objectSpread2.default)({}, body), {}, {
    size: 0
  });
}

function getDisjunctiveFacetCounts(_x, _x2) {
  return _getDisjunctiveFacetCounts.apply(this, arguments);
}
/**
 * This function will re-calculate facets that need to be considered
 * "disjunctive" (also known as "sticky"). Calculating sticky facets correctly
 * requires a second query for each sticky facet.
 *
 * @param {*} json
 * @param {*} state
 * @param {string[]} disjunctiveFacetNames
 *
 * @return {Promise<Object>} A map of updated aggregation counts for the specified facet names
 */


function _getDisjunctiveFacetCounts() {
  _getDisjunctiveFacetCounts = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(state, config) {
    var responses;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return Promise.all( // Note that this could be optimized by *not* executing a request if not
            // filter is currently applied for that field. Kept simple here for
            // clarity.
            config.disjunctiveFacets.map(function (facetName) {
              var newState = removeFilterByName(state, facetName);
              var body = (0, _buildRequest.default)(newState, config);
              body = changeSizeToZero(body);
              body = removeAllFacetsExcept(body, facetName);
              return (0, _runRequest.default)(body);
            }));

          case 2:
            responses = _context.sent;
            return _context.abrupt("return", combineAggregationsFromResponses(responses));

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getDisjunctiveFacetCounts.apply(this, arguments);
}

function applyDisjunctiveFaceting(_x3, _x4, _x5) {
  return _applyDisjunctiveFaceting.apply(this, arguments);
}

function _applyDisjunctiveFaceting() {
  _applyDisjunctiveFaceting = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(json, state, config) {
    var disjunctiveFacetCounts;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return getDisjunctiveFacetCounts(state, config);

          case 2:
            disjunctiveFacetCounts = _context2.sent;
            return _context2.abrupt("return", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, json), {}, {
              aggregations: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, json.aggregations), disjunctiveFacetCounts)
            }));

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _applyDisjunctiveFaceting.apply(this, arguments);
}