"use strict";

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*eslint-disable no-unused-vars*/

/*eslint-enable no-unused-vars*/


var Filter = function (_Component) {
   _inherits(Filter, _Component);

   function Filter(props) {
      _classCallCheck(this, Filter);

      var _this = _possibleConstructorReturn(this, (Filter.__proto__ || Object.getPrototypeOf(Filter)).call(this, props));

      _this.addToSelections = function (item) {
         var selections = [].concat(_toConsumableArray(_this.props.selections), [item]);
         _this.props.setSelections(selections);
      };

      _this.removeFromSelections = function (item) {
         var selections = _this.props.selections.filter(function (selection) {
            return selection != item;
         });
         _this.props.setSelections(selections);
      };

      _this.handleDocumentClick = function (evt) {
         var selections = _reactDom2.default.findDOMNode(_this.refs.selections);
         if (selections && !selections.contains(evt.target)) {
            _this.setState({ display: false });
         }
      };

      _this.clearSelections = function () {
         _this.setState({ selections: [] });
         _this.props.setSelections([]);
      };

      _this.state = {
         display: false,
         handler: null
      };
      return _this;
   }

   _createClass(Filter, [{
      key: "componentDidMount",
      value: function componentDidMount() {
         var handler = document.body.addEventListener("click", this.handleDocumentClick);
         this.setState({ handler: handler });
      }
   }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
         document.body.removeEventListener("click", this.state.handler);
      }
   }, {
      key: "render",
      value: function render() {
         var _this2 = this;

         var display = this.state.display;
         var _props = this.props;
         var selections = _props.selections;
         var name = _props.name;
         var sortIcon = _props.sortIcon;


         var selectionsLength = selections.length;

         var content = null;

         if (display) {

            var filters = this.props.filters.filter(function (f) {
               return selections.indexOf(f) === -1;
            });

            content = _react2.default.createElement(
               "div",
               { className: "filter-content" },
               _react2.default.createElement(
                  "div",
                  { className: "selections", ref: "selections" },
                  selectionsLength > 0 ? _react2.default.createElement(
                     "div",
                     { className: "clear", onClick: function onClick() {
                           return _this2.clearSelections();
                        } },
                     "Clear all filters"
                  ) : null,
                  _react2.default.createElement(
                     "div",
                     { className: "filters" },
                     selections.map(function (s) {
                        return _react2.default.createElement(
                           "div",
                           { className: "selection", key: s, onClick: function onClick() {
                                 return _this2.removeFromSelections(s);
                              } },
                           s
                        );
                     })
                  ),
                  _react2.default.createElement(
                     "div",
                     { className: "choices" },
                     filters.map(function (f) {
                        return _react2.default.createElement(
                           "div",
                           { className: "selection", key: f, onClick: function onClick() {
                                 return _this2.addToSelections(f);
                              } },
                           f
                        );
                     })
                  )
               )
            );
         }

         return _react2.default.createElement(
            "div",
            { className: "head", style: { position: "relative" } },
            _react2.default.createElement(
               "div",
               { className: "head-text", onClick: function onClick() {
                     return _this2.setState({ display: true });
                  } },
               _react2.default.createElement("input", {
                  type: "text",
                  className: "head-input",
                  placeholder: selectionsLength === 0 ? name + " (no filters)" : name + " (" + selectionsLength + " filters)",
                  disabled: true
               })
            ),
            content,
            sortIcon
         );
      }
   }]);

   return Filter;
}(_react.Component);

exports.default = Filter;