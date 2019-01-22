var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ResultList = function (_React$Component) {
  _inherits(ResultList, _React$Component);

  function ResultList(props) {
    _classCallCheck(this, ResultList);

    var _this = _possibleConstructorReturn(this, (ResultList.__proto__ || Object.getPrototypeOf(ResultList)).call(this, props));

    _this.state = { results: [] };
    _this.getResults = _this.getResults.bind(_this);
    return _this;
  }

  _createClass(ResultList, [{
    key: "getResults",
    value: function getResults() {
      var _this2 = this;

      var request = $.ajax({
        url: "/result_list",
        method: "POST",
        data: { 'interest-1': 'Gold', 'seed': 'seed' }
      });

      request.success(function (response) {
        _this2.setState({ results: response });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var results = this.state.results;

      return React.createElement(
        "div",
        { "class": "row" },
        React.createElement(
          "div",
          { "class": "col-6" },
          React.createElement(
            "div",
            { "class": "list-group" },
            React.createElement(
              "button",
              { type: "button", "class": "btn btn-primary btn-sm", onClick: this.getResults },
              "Search"
            )
          )
        ),
        React.createElement(
          "div",
          { "class": "col-6" },
          results.map(function (result) {
            return React.createElement(
              "a",
              { href: "#", "class": "list-group-item list-group-item-action" },
              result
            );
          })
        )
      );
    }
  }]);

  return ResultList;
}(React.Component);

$(function () {
  $("input[id|='interest-input']").autocomplete({
    source: "adinterest",
    minLength: 3
  });

  var domContainer = document.querySelector('#react-container');
  ReactDOM.render(React.createElement(ResultList), domContainer);
});