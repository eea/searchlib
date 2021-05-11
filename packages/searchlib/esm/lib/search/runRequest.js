"use strict";

var _interopRequireDefault = require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = runRequest;

var _regenerator = _interopRequireDefault(require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/asyncToGenerator"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _https = _interopRequireDefault(require("https"));

// Don't do this in production, this is in place to aid with demo environments which have self-signed certificates.
var httpsAgent = new _https.default.Agent({
  rejectUnauthorized: false
});

function runRequest(_x) {
  return _runRequest.apply(this, arguments);
}

function _runRequest() {
  _runRequest = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(body) {
    var host, index, url, resp, _body;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            host = process.env.ELASTICSEARCH_HOST || 'http://localhost:9200';
            index = 'esbootstrapdata-wise_latest'; // const agent = host.startsWith('http:') ? httpAgent : httpsAgent;

            url = "".concat(host, "/").concat(index, "/_search");
            _context.next = 5;
            return (0, _nodeFetch.default)(url, {
              method: 'POST',
              headers: {
                'content-type': 'application/json'
              },
              body: JSON.stringify(body),
              agent: httpsAgent
            });

          case 5:
            resp = _context.sent;
            _context.prev = 6;
            _context.next = 9;
            return resp.text();

          case 9:
            _body = _context.sent;
            return _context.abrupt("return", {
              statusCode: resp.status,
              body: JSON.parse(_body)
            });

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](6);
            return _context.abrupt("return", {
              statusCode: 500,
              body: "An error occurred: ".concat(_context.t0)
            });

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[6, 13]]);
  }));
  return _runRequest.apply(this, arguments);
}