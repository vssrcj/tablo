"use strict";

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _filter = require("./filter");

var _filter2 = _interopRequireDefault(_filter);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*eslint-disable no-unused-vars*/

/*eslint-enable no-unused-vars*/

var Tablo = function (_Component) {
   _inherits(Tablo, _Component);

   function Tablo(props) {
      _classCallCheck(this, Tablo);

      var _this = _possibleConstructorReturn(this, (Tablo.__proto__ || Object.getPrototypeOf(Tablo)).call(this, props));

      _initialiseProps.call(_this);

      var _ref = props.sort ? {
         sort: props.sort,
         trimmed: (0, _utils.sortItems)(props.items, props.sort.key, props.sort.asc)
      } : {
         sort: { key: null, asc: true },
         trimmed: props.items
      };

      var sort = _ref.sort;
      var trimmed = _ref.trimmed;


      _this.state = {
         // id - the id of the sorted column
         // asc - if values in the column is ascending
         sort: sort,

         // the filtered and sorted items
         trimmed: trimmed,

         // index of current page
         page: 0,

         limit: props.limit || 15,

         columns: props.columns.map(function (column) {
            var extras = column.sortable === true || column.sortable === undefined ? { sortable: true } : {};

            var sortable = column.key && (column.sortable || column.sortable === undefined);

            if (column.filterable) {
               var filters = [].concat(_toConsumableArray(new Set(props.items.map(function (i) {
                  return i[column.key];
               }))));
               return _extends({}, column, extras, {
                  selections: [],
                  filters: filters,
                  sortable: sortable
               });
            } else if (!(column.header || column.component) && (column.searchable === true || column.searchable === undefined)) return _extends({}, column, extras, {
               search: "",
               searchable: true,
               sortable: sortable
            });

            return _extends({}, column, extras, {
               sortable: sortable
            });
         })
      };
      return _this;
   }

   /*
    * Sets the current sorted column, and sort the trimmed items
    */


   /*
    * Sets the search term of a column, and then filter and sort the all items
    */


   _createClass(Tablo, [{
      key: "componentWillReceiveProps",


      /*
       * When new items are passed as props, filter and sort them, and
       * add them to the state.
       */
      value: function componentWillReceiveProps(nextProps) {
         var _state = this.state;
         var _state$sort = _state.sort;
         var key = _state$sort.key;
         var asc = _state$sort.asc;
         var columns = _state.columns;
         var items = nextProps.items;


         var trimmed = (0, _utils.filterItems)(items, columns);

         if (key !== null) trimmed = (0, _utils.sortItems)(trimmed, key, asc);

         this.setState({ trimmed: trimmed });
      }

      /*
       * sets the complete selections for a column.
       */


      /*
       * as clear as it comes
       */

   }, {
      key: "render",
      value: function render() {
         var _props = this.props;
         var id = _props.id;
         var noPaging = _props.noPaging;
         var _state2 = this.state;
         var columns = _state2.columns;
         var sort = _state2.sort;
         var trimmed = _state2.trimmed;
         var page = _state2.page;
         var limit = _state2.limit;


         var items = trimmed.slice(page * limit, (page + 1) * limit);

         return _react2.default.createElement(
            "div",
            { className: "tablo--container" },
            this.renderHeader(),
            _react2.default.createElement(
               "table",
               { className: "tablo" },
               _react2.default.createElement(
                  "thead",
                  null,
                  _react2.default.createElement(
                     "tr",
                     null,
                     this.renderColumns(columns, sort)
                  )
               ),
               _react2.default.createElement(
                  "tbody",
                  null,
                  this.renderBody(items, columns, id),
                  this.renderFooter(columns)
               ),
               noPaging ? null : this.renderPaging()
            )
         );
      }
   }]);

   return Tablo;
}(_react.Component);

var _initialiseProps = function _initialiseProps() {
   var _this2 = this;

   this.setSort = function (key) {
      var _state3 = _this2.state;
      var sort = _state3.sort;
      var trimmed = _state3.trimmed;


      var asc = sort.key === key ? !sort.asc : true;

      var sorted = (0, _utils.sortItems)(trimmed, key, asc);

      _this2.setState({ sort: { key: key, asc: asc }, trimmed: sorted });
   };

   this.setSearch = function (key, search) {
      var _state4 = _this2.state;
      var columns = _state4.columns;
      var sort = _state4.sort;
      var items = _this2.props.items;

      // adds search to the column corresponding to the key paramater

      var newColumns = columns.map(function (x) {
         return x.key === key ? _extends({}, x, { search: search }) : x;
      });

      var trimmed = (0, _utils.filterItems)(items, newColumns);

      if (sort.key !== null) trimmed = (0, _utils.sortItems)(trimmed, sort.key, sort.asc);

      _this2.setState({ columns: newColumns, page: 0, trimmed: trimmed });
   };

   this.renderPaging = function () {
      var _state5 = _this2.state;
      var trimmed = _state5.trimmed;
      var page = _state5.page;
      var columns = _state5.columns;
      var limit = _state5.limit;
      var _props2 = _this2.props;
      var items = _props2.items;
      var name = _props2.name;


      var pages = parseInt((trimmed.length - 1) / limit) + 1;

      var itemsCount = items.length;
      var filteredCount = trimmed.length;

      // description shows the paging information
      var description = void 0;

      if (itemsCount <= limit) {
         if (itemsCount != filteredCount) {
            description = "Showing " + filteredCount + " entries (filtered from " + itemsCount + " entries)";
         } else {
            description = "Showing " + itemsCount + " entries";
         }
      } else {
         var first = page * limit + 1;
         var lastLimit = (page + 1) * limit;
         var last = filteredCount < lastLimit ? filteredCount : lastLimit;
         if (itemsCount != filteredCount) {
            description = "Showing " + first + " to " + last + " of " + filteredCount + " entries (filtered from " + itemsCount + " entries)";
         } else {
            description = "Showing " + first + " to " + last + " of " + itemsCount + " entries";
         }
      }

      var descriptionGroup = _react2.default.createElement(
         "span",
         { className: "entries-display" },
         description
      );

      var paging = null;

      if (pages > 1) {
         (function () {

            var firstDots = false;
            var secondDots = false;

            var pageArray = [];
            for (var i = 0; i < pages; i++) {
               pageArray.push(i);
            }

            paging = pageArray.map(function (i) {
               if (i === page) return _react2.default.createElement(
                  "span",
                  { key: i, className: "paging selected" },
                  i + 1
               );else if (i === 0 || i === page - 1 || i === page + 1) return _react2.default.createElement(
                  "span",
                  { key: i, className: "paging", onClick: function onClick() {
                        return _this2.setPage(i);
                     } },
                  i + 1
               );else if (i < page && !firstDots) {
                  firstDots = true;
                  return _react2.default.createElement(
                     "span",
                     { className: "dots", key: i },
                     "..."
                  );
               } else if (i > page && !secondDots) {
                  secondDots = true;
                  return _react2.default.createElement(
                     "span",
                     { className: "dots", key: i },
                     "..."
                  );
               } else return null;
            });
         })();
      }

      return _react2.default.createElement(
         "tfoot",
         null,
         _react2.default.createElement(
            "tr",
            null,
            _react2.default.createElement(
               "td",
               { className: "footer-cell", colSpan: columns.length },
               _react2.default.createElement(
                  "div",
                  { className: "footer-container" },
                  paging,
                  descriptionGroup
               )
            )
         )
      );
   };

   this.renderExportButton = function () {
      var name = _this2.props.name;
      var items = _this2.state.trimmed;

      return name && items.length > 0 ? _react2.default.createElement(
         "button",
         { onClick: function onClick() {
               var result = confirm("Are you sure you want to export this table to an Excel spreadsheet?");
               if (result) (0, _utils.exportTable)(_this2.state.trimmed, _this2.state.columns, name);
            }, className: "export" },
         "Export"
      ) : null;
   };

   this.renderLimitSetter = function (items) {
      var itemsCount = items.length;
      return _this2.props.setLimit ? _react2.default.createElement(
         "div",
         { className: "limit-setter" },
         _react2.default.createElement("input", { type: "number", min: 1, max: itemsCount < 50 ? itemsCount : 50,
            value: _this2.state.limit > itemsCount ? itemsCount : _this2.state.limit, onChange: _this2.setLimit })
      ) : null;
   };

   this.setLimit = function (evnt) {
      _this2.setState({ limit: evnt.target.value, page: 0 });
   };

   this.renderHeader = function () {
      var _props3 = _this2.props;
      var items = _props3.items;
      var header = _props3.header;


      var limitSetter = _this2.renderLimitSetter(items);
      var exportButton = _this2.renderExportButton();

      if (limitSetter || exportButton || header) return _react2.default.createElement(
         "div",
         { className: "header" },
         limitSetter,
         exportButton,
         header || null
      );

      return null;
   };

   this.setSelections = function (columnId, selections) {
      var items = _this2.props.items;


      var columns = _this2.state.columns.map(function (c) {
         return c.key == columnId ? _extends({}, c, { selections: selections }) : c;
      });

      var trimmed = (0, _utils.filterItems)(items, columns);

      _this2.setState({ columns: columns, trimmed: trimmed, page: 0 });
   };

   this.setPage = function (page) {
      return _this2.setState({ page: page });
   };

   this.renderColumns = function (columns, sort) {
      return columns.map(function (column, index) {

         // content will be added directly under a th tag

         var name = column.name || null;

         var sortIcon = column.sortable ? _react2.default.createElement("div", {
            className: "sort" + (sort.key === column.key ? " active" : ""),
            onClick: function onClick() {
               return _this2.setSort(column.key);
            },
            dangerouslySetInnerHTML: {
               __html: sort.key === column.key ? sort.asc ? "&#x25B4;" : "&#x25Be;" : "&#x25B4;"
            }
         }) : null;

         var content = void 0;

         if (column.filterable) {
            var filters = column.filters;
            var selections = column.selections;

            content = _react2.default.createElement(_filter2.default, {
               sortIcon: selections.length == 1 ? null : sortIcon,
               filters: filters,
               selections: selections,
               setSelections: function setSelections(selections) {
                  return _this2.setSelections(column.key, selections);
               },
               name: name
            });
         } else {
            var search = void 0;
            if (column.searchable) {
               search = _react2.default.createElement(
                  "div",
                  { className: "head-text" },
                  _react2.default.createElement("input", { type: "text",
                     onChange: function onChange(event) {
                        return _this2.setSearch(column.key, event.target.value);
                     },
                     className: "head-input",
                     placeholder: name,
                     value: column.search
                  })
               );
            } else if (column.header) {
               search = column.header;
            } else {
               search = _react2.default.createElement(
                  "div",
                  { className: "head-text" },
                  name
               );
            }

            content = _react2.default.createElement(
               "div",
               { className: "head" },
               search,
               column.sortable && (!column.filterable || column.selections.length !== 1) ? sortIcon : null
            );
         }

         var rowClass = column.className && column.filterable ? column.className + " filtering" : column.className ? column.className : column.filterable ? "filtering" : null;

         return _react2.default.createElement(
            "th",
            { key: index, className: rowClass, style: column.width ? { width: column.width } : {} },
            content
         );
      });
   };

   this.renderBody = function (items, columns, key) {
      return items.map(function (item, index) {
         return _react2.default.createElement(
            "tr",
            { key: key ? (0, _utils.getValue)(item, key) : index },
            columns.map(function (column, c) {
               if (column.component) return _react2.default.createElement(
                  "td",
                  { key: c, className: column.className },
                  column.component(item)
               );

               var value = (0, _utils.getValue)(item, column.key);
               if (typeof value == "boolean") value = value ? "True" : "False";
               return _react2.default.createElement(
                  "td",
                  { key: column.key, className: column.className },
                  value
               );
            })
         );
      });
   };

   this.renderFooter = function (columns) {
      var items = _this2.state.trimmed;

      if (columns && columns.some(function (c) {
         return c.sum != null;
      })) {
         return _react2.default.createElement(
            "tr",
            { key: -1, className: "tablo--aggregates" },
            columns.map(function (c, i) {
               if (c.sum != null && items && items.length > 0) {
                  var total = items.map(function (i) {
                     return parseFloat(i[c.key]) || 0;
                  }).reduce(function (a, b) {
                     return a + b;
                  });
                  var content = void 0;
                  if (c.footer) content = c.footer(total);else content = total.toFixed(c.sum);
                  return _react2.default.createElement(
                     "td",
                     { key: i, className: "aggregate-cell" },
                     content
                  );
               } else return _react2.default.createElement("td", { key: i });
            })
         );
      }
      return null;
   };
};

exports.default = Tablo;