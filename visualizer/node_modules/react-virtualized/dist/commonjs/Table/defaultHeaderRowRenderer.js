'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = defaultHeaderRowRenderer;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function defaultHeaderRowRenderer(_ref) {
  var className = _ref.className,
      columns = _ref.columns,
      style = _ref.style;

  return _react2.default.createElement(
    'div',
    {
      className: className,
      role: 'row',
      style: style
    },
    columns
  );
}