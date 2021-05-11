"use strict";

var _interopRequireDefault = require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onResultClick = onResultClick;
exports.onAutocompleteResultClick = onAutocompleteResultClick;
exports.onAutocomplete = onAutocomplete;
exports.onSearch = onSearch;

var _regenerator = _interopRequireDefault(require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/asyncToGenerator"));

var _search = require("./search");

function onResultClick() {
  /* Not implemented */
}

function onAutocompleteResultClick() {
  /* Not implemented */
}

function onAutocomplete(_x) {
  return _onAutocomplete.apply(this, arguments);
}

function _onAutocomplete() {
  _onAutocomplete = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(props) {
    var _config, searchTerm, resultsPerPage, requestBody, json, state;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _config = this;
            searchTerm = props.searchTerm;
            resultsPerPage = 20;
            requestBody = (0, _search.buildRequest)({
              searchTerm: searchTerm
            }, _config);
            _context.next = 6;
            return (0, _search.runRequest)(requestBody, _config);

          case 6:
            json = _context.sent;
            state = (0, _search.buildState)(json.body, resultsPerPage, _config);
            return _context.abrupt("return", {
              autocompletedResults: state.results
            });

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _onAutocomplete.apply(this, arguments);
}

function onSearch(_x2) {
  return _onSearch.apply(this, arguments);
}

function _onSearch() {
  _onSearch = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(state) {
    var _config, resultsPerPage, requestBody, responseJson, body, responseJsonWithDisjunctiveFacetCounts, newState;

    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _config = this;
            resultsPerPage = state.resultsPerPage;
            requestBody = (0, _search.buildRequest)(state, _config); // Note that this could be optimized by running all of these requests
            // at the same time. Kept simple here for clarity.

            _context2.next = 5;
            return (0, _search.runRequest)(requestBody, _config);

          case 5:
            responseJson = _context2.sent;
            body = responseJson.body;
            _context2.next = 9;
            return (0, _search.applyDisjunctiveFaceting)(body, state, _config);

          case 9:
            responseJsonWithDisjunctiveFacetCounts = _context2.sent;
            newState = (0, _search.buildState)(responseJsonWithDisjunctiveFacetCounts, resultsPerPage, _config);
            return _context2.abrupt("return", newState);

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _onSearch.apply(this, arguments);
}