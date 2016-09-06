"use strict";

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TABLE_TYPE = {
   SIMPLE: 0,
   EDIT: 1,
   SELECT: 2
};

var Tablo = function (_React$Component) {
   _inherits(Tablo, _React$Component);

   function Tablo(props) {
      _classCallCheck(this, Tablo);

      var _this = _possibleConstructorReturn(this, (Tablo.__proto__ || Object.getPrototypeOf(Tablo)).call(this, props));

      _this.setSort = function (id) {
         var _this$state = _this.state;
         var sort = _this$state.sort;
         var filtered = _this$state.filtered;


         var asc = sort.id === id ? !sort.asc : true;

         var sorted = _this.sortTable(id, asc, filtered);

         _this.setState({ sort: { id: id, asc: asc }, filtered: sorted });
      };

      _this.filterTable = function (items, columns) {

         var searchAbles = columns.filter(function (c) {
            return c.search !== "";
         });
         return items.filter(function (item) {
            for (var i in searchAbles) {
               var _searchAbles$i = searchAbles[i];
               var id = _searchAbles$i.id;
               var search = _searchAbles$i.search;

               var val = item[id];
               search = search.toLowerCase();

               if (typeof val === "string") {
                  val = val.toLowerCase();
                  if (val.indexOf(search) < 0) return false;
               } else if (typeof val === "boolean") {
                  if (val) {
                     if (search != "1" && "true".indexOf(search) < 0) return false;
                  } else {
                     if (search != "0" && "false".indexOf(search) < 0) return false;
                  }
               } else if (typeof val === "number") {
                  var check = parseFloat(search);
                  if (isNaN(check)) return false;
                  if (check !== val) return false;
               } else return false;
            }
            return true;
         });
      };

      _this.sortTable = function (id, asc, filtered) {

         var L = asc ? -1 : 1;
         var R = asc ? 1 : -1;
         return filtered.sort(function (a, b) {
            var A = a[id];
            if (typeof A === "string") A = A.toUpperCase();
            var B = b[id];
            if (typeof B === "string") B = B.toUpperCase();
            if (A < B) return L;
            if (A > B) return R;else return 0;
         });
      };

      _this.setSearch = function (id, search) {
         var _this$state2 = _this.state;
         var items = _this$state2.items;
         var columns = _this$state2.columns;


         var newColumns = columns.map(function (x) {
            return x.id === id ? _extends({}, x, { search: search }) : x;
         });

         var filtered = _this.filterTable(items, newColumns);

         _this.setState({ columns: newColumns, page: 1, filtered: filtered });
      };

      _this.renderFooter = function (colSpan) {
         var _this$state3 = _this.state;
         var items = _this$state3.items;
         var filtered = _this$state3.filtered;
         var page = _this$state3.page;
         var limit = _this.props.limit;


         var pages = parseInt((filtered.length - 1) / limit) + 1;

         var itemsCount = items.length;
         var filteredCount = filtered.length;

         var first = (page - 1) * limit + 1;
         var lastCalc = page * limit;
         var last = filteredCount < lastCalc ? filteredCount : lastCalc;

         var showLast = itemsCount === filteredCount ? "" : "  (filtered from " + itemsCount + " entries)";
         var showMiddle = filteredCount < limit ? "" : "to " + last + " ";

         if (filteredCount === 0) first = 0;

         var description = _react2.default.createElement(
            "span",
            { className: "entries-display" },
            "Showing " + first + " " + showMiddle + "of " + filteredCount + " entries" + showLast
         );

         if (pages === 1) return _react2.default.createElement(
            "td",
            { className: "footer-cell", colSpan: colSpan },
            description
         );

         var firstDots = false;
         var secondDots = false;

         var p = [];
         for (var i = 0; i < pages; i++) {
            p.push(i);
         }
         var paging = p.map(function (item) {
            if (item + 1 === page) return _react2.default.createElement(
               "span",
               { key: item, className: "paging selected" },
               item
            );else if (item === 0 || item === page || item + 2 === page) return _react2.default.createElement(
               "span",
               { key: item, className: "paging", onClick: function onClick() {
                     return _this.setPage(item + 1);
                  } },
               item
            );else if (item < page && !firstDots) {
               firstDots = true;
               return _react2.default.createElement(
                  "span",
                  { key: item },
                  "..."
               );
            } else if (item > page && !secondDots) {
               secondDots = true;
               return _react2.default.createElement(
                  "span",
                  { key: item },
                  "..."
               );
            } else return null;
         });

         return _react2.default.createElement(
            "td",
            { className: "footer-cell", colSpan: colSpan },
            _react2.default.createElement(
               "div",
               { className: "footer-container" },
               paging,
               description
            )
         );
      };

      _this.setPage = function (page) {
         return _this.setState({ page: page });
      };

      _this.renderFirstHeader = function (type) {
         switch (type) {
            case TABLE_TYPE.SIMPLE:
               return null;
            case TABLE_TYPE.EDIT:
               return _react2.default.createElement(
                  "th",
                  { className: "add" },
                  _react2.default.createElement(
                     "i",
                     { className: "material-icons", onClick: function onClick() {
                           return _this.props.onCreate();
                        } },
                     "add"
                  )
               );
            case TABLE_TYPE.SELECT:
               return _react2.default.createElement("th", { className: "select" });
         }
      };

      _this.renderColumns = function (columns, sort) {
         return columns.map(function (column) {
            return _react2.default.createElement(
               "th",
               { key: column.id },
               _react2.default.createElement(
                  "div",
                  { className: "head" },
                  _react2.default.createElement(
                     "div",
                     { className: "head-text" },
                     " ",
                     column.format === undefined ? _react2.default.createElement("input", { type: "text",
                        onChange: function onChange(event) {
                           return _this.setSearch(column.id, event.target.value);
                        },
                        className: "head-input",
                        placeholder: column.name,
                        value: column.search
                     }) : _react2.default.createElement(
                        "span",
                        null,
                        column.name
                     )
                  ),
                  _react2.default.createElement(
                     "i",
                     { className: "material-icons sort", onClick: function onClick() {
                           return _this.setSort(column.id);
                        } },
                     " ",
                     sort.id === column.id ? sort.asc ? "vertical_align_bottom" : "vertical_align_top" : "vertical_align_center"
                  )
               )
            );
         });
      };

      _this.renderFirstColumn = function (item) {
         var type = _this.state.type;
         var _this$props = _this.props;
         var selected = _this$props.selected;
         var id = _this$props.id;

         switch (type) {
            case TABLE_TYPE.SIMPLE:
               return null;
            case TABLE_TYPE.EDIT:
               return _react2.default.createElement(
                  "td",
                  { key: 0, className: "first-col" },
                  _react2.default.createElement(
                     "i",
                     { className: "material-icons edit", onClick: function onClick() {
                           return _this.props.onUpdate(item);
                        } },
                     "edit"
                  ),
                  _react2.default.createElement(
                     "i",
                     { className: "material-icons close", onClick: function onClick() {
                           return _this.props.onDelete(item);
                        } },
                     "close"
                  )
               );
            case TABLE_TYPE.SELECT:
               var currentId = item[id];
               var selectedId = selected ? selected[id] : null;
               return _react2.default.createElement(
                  "td",
                  { key: 0, className: "first-col" },
                  " ",
                  currentId === selectedId ? _react2.default.createElement(
                     "i",
                     { className: "material-icons", onCheck: function onCheck() {
                           _this.props.onSelect(null);
                        } },
                     "check_box"
                  ) : _react2.default.createElement(
                     "i",
                     { className: "material-icons", onCheck: function onCheck() {
                           _this.props.onSelect(item);
                        } },
                     "check_box_outline_blank"
                  )
               );
         }
      };

      _this.renderBody = function (items, columns, id) {
         return items.map(function (item, index) {
            return _react2.default.createElement(
               "tr",
               { key: id ? item[id] : index },
               _this.renderFirstColumn(item),
               columns.map(function (column) {
                  var value = item[column.id];
                  if (typeof valuue == "boolean") value = value ? "True" : "False";
                  return _react2.default.createElement(
                     "td",
                     { key: column.id },
                     value
                  );
               })
            );
         });
      };

      _this.state = {
         sort: props.sort ? props.sort : {
            id: null,
            asc: true
         },
         type: props.onSelect ? TABLE_TYPE.SELECT : props.onCreate ? TABLE_TYPE.EDIT : TABLE_TYPE.SIMPLE,
         items: props.items,
         filtered: props.sort ? _this.sortTable(props.sort.id, props.sort.asc, props.items) : props.items,
         page: 1,
         columns: props.columns.map(function (column) {
            return _extends({}, column, { search: "" });
         })
      };
      return _this;
   }

   _createClass(Tablo, [{
      key: "componentWillReceiveProps",
      value: function componentWillReceiveProps(nextProps) {
         var _state = this.state;
         var _state$sort = _state.sort;
         var id = _state$sort.id;
         var asc = _state$sort.asc;
         var columns = _state.columns;
         var items = nextProps.items;


         var filtered = this.filterTable(items, columns);

         if (id !== null) filtered = this.sortTable(id, asc, filtered);

         this.setState({ filtered: filtered, items: items });
      }
   }, {
      key: "render",
      value: function render() {
         var _props = this.props;
         var id = _props.id;
         var limit = _props.limit;
         var onCreate = _props.onCreate;
         var onSelect = _props.onSelect;
         var onUpdate = _props.onUpdate;
         var onDelete = _props.onDelete;
         var noPaper = _props.noPaper;
         var _state2 = this.state;
         var columns = _state2.columns;
         var sort = _state2.sort;
         var filtered = _state2.filtered;
         var page = _state2.page;
         var type = _state2.type;

         var items = filtered.slice((page - 1) * limit, page * limit);

         return _react2.default.createElement(
            "div",
            { className: "tablo--container" },
            _react2.default.createElement(
               "table",
               { className: "tablo" },
               _react2.default.createElement(
                  "thead",
                  null,
                  _react2.default.createElement(
                     "tr",
                     null,
                     this.renderFirstHeader(type),
                     this.renderColumns(columns, sort)
                  )
               ),
               _react2.default.createElement(
                  "tbody",
                  null,
                  this.renderBody(items, columns, id),
                  _react2.default.createElement(
                     "tr",
                     { key: 0 },
                     this.renderFooter(columns.length + (TABLE_TYPE === TABLE_TYPE.SIMPLE ? 0 : 1))
                  )
               )
            )
         );
      }
   }]);

   return Tablo;
}(_react2.default.Component);

exports.default = Tablo;
