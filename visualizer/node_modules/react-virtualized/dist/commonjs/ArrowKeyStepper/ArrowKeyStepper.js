'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * This HOC decorates a virtualized component and responds to arrow-key events by scrolling one row or column at a time.
 */
var ArrowKeyStepper = function (_PureComponent) {
  _inherits(ArrowKeyStepper, _PureComponent);

  function ArrowKeyStepper(props, context) {
    _classCallCheck(this, ArrowKeyStepper);

    var _this = _possibleConstructorReturn(this, (ArrowKeyStepper.__proto__ || Object.getPrototypeOf(ArrowKeyStepper)).call(this, props, context));

    _this.state = {
      scrollToColumn: props.scrollToColumn,
      scrollToRow: props.scrollToRow
    };

    _this._columnStartIndex = 0;
    _this._columnStopIndex = 0;
    _this._rowStartIndex = 0;
    _this._rowStopIndex = 0;

    _this._onKeyDown = _this._onKeyDown.bind(_this);
    _this._onSectionRendered = _this._onSectionRendered.bind(_this);
    return _this;
  }

  _createClass(ArrowKeyStepper, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.isControlled) {
        return;
      }

      var scrollToColumn = nextProps.scrollToColumn,
          scrollToRow = nextProps.scrollToRow;
      var _props = this.props,
          prevScrollToColumn = _props.scrollToColumn,
          prevScrollToRow = _props.scrollToRow;


      if (prevScrollToColumn !== scrollToColumn && prevScrollToRow !== scrollToRow) {
        this.setState({
          scrollToColumn: scrollToColumn,
          scrollToRow: scrollToRow
        });
      } else if (prevScrollToColumn !== scrollToColumn) {
        this.setState({ scrollToColumn: scrollToColumn });
      } else if (prevScrollToRow !== scrollToRow) {
        this.setState({ scrollToRow: scrollToRow });
      }
    }
  }, {
    key: 'setScrollIndexes',
    value: function setScrollIndexes(_ref) {
      var scrollToColumn = _ref.scrollToColumn,
          scrollToRow = _ref.scrollToRow;

      this.setState({
        scrollToRow: scrollToRow,
        scrollToColumn: scrollToColumn
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          className = _props2.className,
          children = _props2.children;

      var _getScrollState2 = this._getScrollState(),
          scrollToColumn = _getScrollState2.scrollToColumn,
          scrollToRow = _getScrollState2.scrollToRow;

      return _react2.default.createElement(
        'div',
        {
          className: className,
          onKeyDown: this._onKeyDown
        },
        children({
          onSectionRendered: this._onSectionRendered,
          scrollToColumn: scrollToColumn,
          scrollToRow: scrollToRow
        })
      );
    }
  }, {
    key: '_onKeyDown',
    value: function _onKeyDown(event) {
      var _props3 = this.props,
          columnCount = _props3.columnCount,
          disabled = _props3.disabled,
          mode = _props3.mode,
          rowCount = _props3.rowCount;


      if (disabled) {
        return;
      }

      var _getScrollState3 = this._getScrollState(),
          scrollToColumnPrevious = _getScrollState3.scrollToColumn,
          scrollToRowPrevious = _getScrollState3.scrollToRow;

      var _getScrollState4 = this._getScrollState(),
          scrollToColumn = _getScrollState4.scrollToColumn,
          scrollToRow = _getScrollState4.scrollToRow;

      // The above cases all prevent default event event behavior.
      // This is to keep the grid from scrolling after the snap-to update.


      switch (event.key) {
        case 'ArrowDown':
          scrollToRow = mode === 'cells' ? Math.min(scrollToRow + 1, rowCount - 1) : Math.min(this._rowStopIndex + 1, rowCount - 1);
          break;
        case 'ArrowLeft':
          scrollToColumn = mode === 'cells' ? Math.max(scrollToColumn - 1, 0) : Math.max(this._columnStartIndex - 1, 0);
          break;
        case 'ArrowRight':
          scrollToColumn = mode === 'cells' ? Math.min(scrollToColumn + 1, columnCount - 1) : Math.min(this._columnStopIndex + 1, columnCount - 1);
          break;
        case 'ArrowUp':
          scrollToRow = mode === 'cells' ? Math.max(scrollToRow - 1, 0) : Math.max(this._rowStartIndex - 1, 0);
          break;
      }

      if (scrollToColumn !== scrollToColumnPrevious || scrollToRow !== scrollToRowPrevious) {
        event.preventDefault();

        this._updateScrollState({ scrollToColumn: scrollToColumn, scrollToRow: scrollToRow });
      }
    }
  }, {
    key: '_onSectionRendered',
    value: function _onSectionRendered(_ref2) {
      var columnStartIndex = _ref2.columnStartIndex,
          columnStopIndex = _ref2.columnStopIndex,
          rowStartIndex = _ref2.rowStartIndex,
          rowStopIndex = _ref2.rowStopIndex;

      this._columnStartIndex = columnStartIndex;
      this._columnStopIndex = columnStopIndex;
      this._rowStartIndex = rowStartIndex;
      this._rowStopIndex = rowStopIndex;
    }
  }, {
    key: '_getScrollState',
    value: function _getScrollState() {
      return this.props.isControlled ? this.props : this.state;
    }
  }, {
    key: '_updateScrollState',
    value: function _updateScrollState(_ref3) {
      var scrollToColumn = _ref3.scrollToColumn,
          scrollToRow = _ref3.scrollToRow;
      var _props4 = this.props,
          isControlled = _props4.isControlled,
          onScrollToChange = _props4.onScrollToChange;


      if (typeof onScrollToChange === 'function') {
        onScrollToChange({ scrollToColumn: scrollToColumn, scrollToRow: scrollToRow });
      }

      if (!isControlled) {
        this.setState({ scrollToColumn: scrollToColumn, scrollToRow: scrollToRow });
      }
    }
  }]);

  return ArrowKeyStepper;
}(_react.PureComponent);

ArrowKeyStepper.defaultProps = {
  disabled: false,
  isControlled: false,
  mode: 'edges',
  scrollToColumn: 0,
  scrollToRow: 0
};
exports.default = ArrowKeyStepper;
process.env.NODE_ENV !== "production" ? ArrowKeyStepper.propTypes = {
  children: _propTypes2.default.func.isRequired,
  className: _propTypes2.default.string,
  columnCount: _propTypes2.default.number.isRequired,
  disabled: _propTypes2.default.bool.isRequired,
  isControlled: _propTypes2.default.bool.isRequired,
  mode: _propTypes2.default.oneOf(['cells', 'edges']),
  onScrollToChange: _propTypes2.default.func,
  rowCount: _propTypes2.default.number.isRequired,
  scrollToColumn: _propTypes2.default.number.isRequired,
  scrollToRow: _propTypes2.default.number.isRequired
} : void 0;