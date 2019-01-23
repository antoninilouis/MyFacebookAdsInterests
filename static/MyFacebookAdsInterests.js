var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var _ref = [a[j], a[i]];
    a[i] = _ref[0];
    a[j] = _ref[1];
  }
  return a;
}

var InterestInputList = function InterestInputList(_ref2) {
  var nbInput = _ref2.nbInput,
      inputValues = _ref2.inputValues,
      updateInputValues = _ref2.updateInputValues;

  var l = [];
  for (var index = 0; index < nbInput; index++) {
    var id = 'interest-' + index;
    l.push(React.createElement(
      "div",
      { "class": "form-group" },
      React.createElement("input", { type: "text", "class": "form-control form-control-sm", placeholder: id, value: inputValues[id], onChange: updateInputValues, id: id })
    ));
  }
  return l;
};

var Loader = function Loader(_ref3) {
  var isLoading = _ref3.isLoading;

  if (isLoading) {
    return React.createElement("img", { src: "static/img/ajax-loader.gif", alt: "Loader" });
  }
  return null;
};

var InterestList = function InterestList(_ref4) {
  var nbList = _ref4.nbList,
      interests = _ref4.interests,
      selectInterest = _ref4.selectInterest;

  var l = [];
  var len = Object.keys(interests).length;
  var sliceLen = Math.ceil(len / nbList);
  var beg = 0;
  var end = sliceLen;
  var keys = Object.keys(interests);

  shuffle(keys);
  while (beg < len) {
    var slice = keys.slice(beg, end).map(function (key) {
      var interest = interests[key];
      return React.createElement(
        "a",
        { href: "#", "class": "list-group-item list-group-item-action d-flex justify-content-between align-items-center", onClick: selectInterest, id: interest.name },
        interest.name,
        React.createElement(
          "span",
          { "class": "badge badge-primary badge-pill" },
          interest.audience_size.toLocaleString()
        )
      );
    });
    l = l.concat(slice);
    l.push(React.createElement("br", null));

    beg += sliceLen;
    end += sliceLen;
  }

  return l;
};

var InterestForm = function (_React$Component) {
  _inherits(InterestForm, _React$Component);

  function InterestForm(props) {
    _classCallCheck(this, InterestForm);

    var _this = _possibleConstructorReturn(this, (InterestForm.__proto__ || Object.getPrototypeOf(InterestForm)).call(this, props));

    _this.state = {
      inputValues: {},
      isLoading: false,
      results: [],
      interests: {},
      nbInput: 3,
      nbList: 1
    };
    _this.addSplit = _this.addSplit.bind(_this);
    _this.subSplit = _this.subSplit.bind(_this);
    _this.updateInputValues = _this.updateInputValues.bind(_this);
    _this.selectResult = _this.selectResult.bind(_this);
    _this.selectInterest = _this.selectInterest.bind(_this);
    _this.getResults = _this.getResults.bind(_this);
    _this.aucomplete = React.createRef();
    return _this;
  }

  _createClass(InterestForm, [{
    key: "addSplit",
    value: function addSplit(e) {
      if (this.state.nbList < 10) {
        this.setState({
          nbList: this.state.nbList + 1
        });
      }
    }
  }, {
    key: "subSplit",
    value: function subSplit(e) {
      if (this.state.nbList > 0) {
        this.setState({
          nbList: this.state.nbList - 1
        });
      }
    }
  }, {
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
    key: "selectInterest",
    value: function selectInterest(e) {
      var interests = this.state.interests;
      delete interests[e.target.id];

      this.setState({
        interests: interests
      });
    }
  }, {
    key: "getResults",
    value: function getResults() {
      var _this2 = this;

      var inputValues = this.state.inputValues;

      $.ajax({
        url: "/result_list",
        method: "POST",
        data: inputValues,
        beforeSend: function beforeSend() {
          _this2.setState({ isLoading: true });
        },
        complete: function complete() {
          _this2.setState({ isLoading: false });
        },
        success: function success(response) {
          _this2.setState({ results: response });
        }
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var thisRef = this;
      var node = this.aucomplete.current;
      $(ReactDOM.findDOMNode(node)).find('input').autocomplete({
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
                { ref: this.aucomplete },
                React.createElement(InterestInputList, { nbInput: this.state.nbInput, inputValues: this.state.inputValues, updateInputValues: this.updateInputValues }),
                React.createElement(
                  "button",
                  { type: "button", "class": "btn btn-primary btn-sm", onClick: this.getResults },
                  "Search"
                ),
                React.createElement(
                  "button",
                  { type: "button", "class": "btn btn-outline-primary btn-sm", onClick: this.addSplit },
                  "+ split"
                ),
                React.createElement(
                  "button",
                  { type: "button", "class": "btn btn-outline-primary btn-sm", onClick: this.subSplit },
                  "- split"
                ),
                React.createElement(Loader, { isLoading: this.state.isLoading })
              )
            ),
            React.createElement(
              "div",
              { "class": "list-group" },
              "(",
              Object.keys(interests).length,
              ")",
              React.createElement(InterestList, { nbList: this.state.nbList, interests: interests, selectInterest: this.selectInterest })
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
                    { href: "#", "class": "list-group-item list-group-item-action active d-flex justify-content-between align-items-center", onClick: _this3.selectResult, id: index },
                    result.name,
                    React.createElement(
                      "span",
                      { "class": "badge badge-primary badge-pill" },
                      result.audience_size.toLocaleString()
                    )
                  );
                } else {
                  return React.createElement(
                    "a",
                    { href: "#", "class": "list-group-item list-group-item-action d-flex justify-content-between align-items-center", onClick: _this3.selectResult, id: index },
                    result.name,
                    React.createElement(
                      "span",
                      { "class": "badge badge-primary badge-pill" },
                      result.audience_size.toLocaleString()
                    )
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
  ReactDOM.render(React.createElement(InterestForm, null), domContainer);
});