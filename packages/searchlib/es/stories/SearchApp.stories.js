"use strict";

var _interopRequireDefault = require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Full = exports.default = void 0;

var _SearchApp = _interopRequireDefault(require("@eeacms/search/SearchApp"));

var _registry = _interopRequireDefault(require("@eeacms/search/registry"));

var _demo = _interopRequireDefault(require("@eeacms/search/demo"));

require("@eeacms/search/index.css");

require("@eeacms/search/semantic-ui.less");

var page = {
  title: 'Search UI/Demos',
  component: _SearchApp.default,
  args: {
    appName: 'wise'
  },
  argTypes: {
    appName: {
      control: {
        type: 'select',
        options: ['wise', 'minimal']
      }
    },
    debug: {
      control: {
        type: 'boolean'
      }
    }
  }
};
var _default = page;
exports.default = _default;

var Template = function Template(args) {
  var registry = (0, _demo.default)(_registry.default);
  return /*#__PURE__*/React.createElement(_SearchApp.default, Object.assign({
    registry: registry
  }, args));
};

var Full = Template.bind({}); // WiseDemo.args = {
//   appName: 'wise',
// };

exports.Full = Full;