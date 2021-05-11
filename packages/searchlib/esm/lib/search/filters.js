"use strict";

var _interopRequireDefault = require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTermFilterValue = getTermFilterValue;
exports.getTermFilter = getTermFilter;
exports.getRangeFilter = getRangeFilter;

var _objectSpread2 = _interopRequireDefault(require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectSpread2"));

var _defineProperty2 = _interopRequireDefault(require("/home/tibi/work/searchlib/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/defineProperty"));

function getTermFilterValue(field, fieldValue) {
  // We do this because if the value is a boolean value, we need to apply
  // our filter differently. We're also only storing the string representation
  // of the boolean value, so we need to convert it to a Boolean.
  // TODO We need better approach for boolean values
  if (fieldValue === 'false' || fieldValue === 'true') {
    return (0, _defineProperty2.default)({}, field, fieldValue === 'true');
  }

  return (0, _defineProperty2.default)({}, "".concat(field), fieldValue);
}

function getTermFilter(filter) {
  if (filter.type === 'any') {
    return {
      bool: {
        should: filter.values.map(function (filterValue) {
          return {
            term: getTermFilterValue(filter.field, filterValue)
          };
        }),
        minimum_should_match: 1
      }
    };
  } else if (filter.type === 'all') {
    return {
      bool: {
        filter: filter.values.map(function (filterValue) {
          return {
            term: getTermFilterValue(filter.field, filterValue)
          };
        })
      }
    };
  }
}

function getRangeFilter(filter) {
  if (filter.type === 'any') {
    return {
      bool: {
        should: filter.values.map(function (filterValue) {
          return {
            range: (0, _defineProperty2.default)({}, filter.field, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, filterValue.to && {
              lt: filterValue.to
            }), filterValue.to && {
              gt: filterValue.from
            }))
          };
        }),
        minimum_should_match: 1
      }
    };
  } else if (filter.type === 'all') {
    return {
      bool: {
        filter: filter.values.map(function (filterValue) {
          return {
            range: (0, _defineProperty2.default)({}, filter.field, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, filterValue.to && {
              lt: filterValue.to
            }), filterValue.to && {
              gt: filterValue.from
            }))
          };
        })
      }
    };
  }
}