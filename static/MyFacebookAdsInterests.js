var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InterestForm = function (_React$Component) {
  _inherits(InterestForm, _React$Component);

  function InterestForm(props) {
    _classCallCheck(this, InterestForm);

    var _this = _possibleConstructorReturn(this, (InterestForm.__proto__ || Object.getPrototypeOf(InterestForm)).call(this, props));

    _this.state = {
      inputValues: {},
      results: [],
      interests: {}
    };
    _this.updateInputValues = _this.updateInputValues.bind(_this);
    _this.selectResult = _this.selectResult.bind(_this);
    _this.getResults = _this.getResults.bind(_this);
    _this.aucomplete = React.createRef();
    return _this;
  }

  _createClass(InterestForm, [{
    key: "updateInputValues",
    value: function updateInputValues(e) {
      var inputValues = this.state.inputValues;
      inputValues[e.target.id] = e.target.value;
      this.setState({
        inputValues: inputValues
      });
    }
  }, {
    key: "selectResult",
    value: function selectResult(e) {
      var results = this.state.results;
      var interests = this.state.interests;
      var selectedName = results[e.target.id]['name'];

      if (interests.hasOwnProperty(selectedName)) {
        delete interests[selectedName];
      } else {
        interests[selectedName] = results[e.target.id];
      }

      this.setState({
        interests: interests
      });
    }
  }, {
    key: "getResults",
    value: function getResults() {
      var _this2 = this;

      var inputValues = this.state.inputValues;

      var request = $.ajax({
        url: "/result_list",
        method: "POST",
        data: inputValues
      });

      request.success(function (response) {
        _this2.setState({ results: response });
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var thisRef = this;
      var node = this.aucomplete.current;
      $(ReactDOM.findDOMNode(node)).children('input').autocomplete({
        source: "adinterest",
        minLength: 3,
        select: function select(event, ui) {
          var inputValues = thisRef.state.inputValues;
          inputValues[this.id] = ui.item.value;
          thisRef.setState({
            inputValues: inputValues
          });
        }
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var node = this.autocomplete.current;
      $(ReactDOM.findDOMNode(node)).autocomplete('destroy');
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var results = this.state.results;
      var interests = this.state.interests;

      return React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          { "class": "row" },
          React.createElement(
            "div",
            { "class": "col-6" },
            React.createElement(
              "form",
              null,
              React.createElement(
                "div",
                { "class": "form-group", ref: this.aucomplete },
                React.createElement("input", { type: "text", "class": "form-control", value: this.state.inputValues['interest-1'], onChange: this.updateInputValues, id: "interest-1" }),
                React.createElement("input", { type: "text", "class": "form-control", value: this.state.inputValues['interest-2'], onChange: this.updateInputValues, id: "interest-2" }),
                React.createElement("input", { type: "text", "class": "form-control", value: this.state.inputValues['interest-3'], onChange: this.updateInputValues, id: "interest-3" })
              ),
              React.createElement(
                "button",
                { type: "button", "class": "btn btn-primary btn-sm", onClick: this.getResults },
                "Search"
              )
            ),
            React.createElement("br", null),
            React.createElement(
              "div",
              { "class": "list-group" },
              "(",
              Object.keys(interests).length,
              ")",
              Object.keys(interests).map(function (key, index) {
                var interest = interests[key];
                return React.createElement(
                  "a",
                  { href: "#", "class": "list-group-item list-group-item-action", id: index },
                  interest.name,
                  " (",
                  interest.audience_size,
                  ")"
                );
              })
            )
          ),
          React.createElement(
            "div",
            { "class": "col-6" },
            React.createElement(
              "div",
              { "class": "list-group" },
              "(",
              results.length,
              ")",
              results.map(function (result, index) {
                if (interests.hasOwnProperty(result.name)) {
                  return React.createElement(
                    "a",
                    { href: "#", "class": "list-group-item list-group-item-action active", onClick: _this3.selectResult, id: index },
                    result.name,
                    " (",
                    result.audience_size,
                    ")"
                  );
                } else {
                  return React.createElement(
                    "a",
                    { href: "#", "class": "list-group-item list-group-item-action", onClick: _this3.selectResult, id: index },
                    result.name,
                    " (",
                    result.audience_size,
                    ")"
                  );
                }
              })
            )
          )
        )
      );
    }
  }]);

  return InterestForm;
}(React.Component);

$(function () {
  var domContainer = document.querySelector('#react-container');
  ReactDOM.render(React.createElement(InterestForm), domContainer);
});