'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = defaultCellRenderer;


/**
 * Default cell renderer that displays an attribute as a simple string
 * You should override the column's cellRenderer if your data is some other type of object.
 */
function defaultCellRenderer(_ref) {
  var cellData = _ref.cellData,
      columnData = _ref.columnData,
      columnIndex = _ref.columnIndex,
      dataKey = _ref.dataKey,
      isScrolling = _ref.isScrolling,
      rowData = _ref.rowData,
      rowIndex = _ref.rowIndex;

  if (cellData == null) {
    return '';
  } else {
    return String(cellData);
  }
}