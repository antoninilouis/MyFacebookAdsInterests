class ResultList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      results: []
    };
    this.updateInputValue = this.updateInputValue.bind(this);
    this.getResults = this.getResults.bind(this);
    this.aucomplete = React.createRef();
  }

  updateInputValue(e) {
    this.setState({
      inputValue: e.target.value
    });
  }

  getResults() {

    var request = $.ajax({
      url: "/result_list",
      method: "POST",
      data: { 'interest-1': this.state.inputValue, 'seed': 'seed' }
    });
    
    request.success((response) => {
      this.setState({results: response});
    });
  }

  componentDidMount() {
    var node = this.aucomplete.current;
    $(ReactDOM.findDOMNode(node)).autocomplete({
      source: "adinterest",
      minLength: 3,
      select: (event, ui) => {
        this.setState({inputValue: ui.item.value});
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
              <div class="form-group">
                <input type="text" class="form-control" value={this.state.inputValue} onChange={this.updateInputValue} ref={this.aucomplete} id="interest-input"></input>
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
