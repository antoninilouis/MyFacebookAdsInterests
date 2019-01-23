class ResultList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValues: {
        'seed': 'seed'
      },
      results: []
    };
    this.updateInputValues = this.updateInputValues.bind(this);
    this.getResults = this.getResults.bind(this);
    this.aucomplete = React.createRef();
  }

  updateInputValues(e) {
    let inputValues = this.state.inputValues;
    inputValues[e.target.id] = e.target.value;
    this.setState({
      inputValues: inputValues
    });
  }

  getResults() {
    var request = $.ajax({
      url: "/result_list",
      method: "POST",
      data: this.state.inputValues
    });
    
    request.success((response) => {
      this.setState({results: response});
    });
  }

  componentDidMount() {
    var thisRef = this;
    var node = this.aucomplete.current;
    $(ReactDOM.findDOMNode(node)).children('input').autocomplete({
      source: "adinterest",
      minLength: 3,
      select: function(event, ui) {
        let inputValues = thisRef.state.inputValues;
        inputValues[this.id] = ui.item.value;
        thisRef.setState({
          inputValues: inputValues
        });
      }
    });
  }

  componentWillUnmount() {
    var node = this.autocomplete.current;
    $(ReactDOM.findDOMNode(node)).autocomplete('destroy');
  }
  
  render() {
    let results = this.state.results;

    return (
      <div>
        <div class="row">
          <div class="col-6">
            <form>
              <div class="form-group" ref={this.aucomplete}>
                <input type="text" class="form-control" value={this.state.inputValues['interest-1']} onChange={this.updateInputValues} id="interest-1"></input>
                <input type="text" class="form-control" value={this.state.inputValues['interest-2']} onChange={this.updateInputValues} id="interest-2"></input>
                <input type="text" class="form-control" value={this.state.inputValues['interest-3']} onChange={this.updateInputValues} id="interest-3"></input>
              </div>
              <button type="button" class="btn btn-primary btn-sm" onClick={this.getResults}>Search</button>
            </form>
          </div>
          <div class="col-6">
            <div class="list-group">
              {results.map((result) =>
                <a href="#" class="list-group-item list-group-item-action">{result}</a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

$( function() {
    const domContainer = document.querySelector('#react-container');
    ReactDOM.render(React.createElement(ResultList), domContainer);
} );
