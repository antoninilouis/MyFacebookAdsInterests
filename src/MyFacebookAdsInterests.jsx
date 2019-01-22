class ResultList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { results: []};
    this.getResults = this.getResults.bind(this);
  }

  getResults() {
    var request = $.ajax({
      url: "/result_list",
      method: "POST",
      data: { 'interest-1': 'Gold', 'seed': 'seed' }
    });
    
    request.success((response) => {
      this.setState({results: response});
    });
  }

  render() {
    let results = this.state.results;

    return (
      <div class="row">
        <div class="col-6">
          <div class="list-group">
            <button type="button" class="btn btn-primary btn-sm" onClick={this.getResults}>Search</button>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          {results.map((result) =>
            <a href="#" class="list-group-item list-group-item-action">{result}</a>
          )}
        </div>
      </div>
    );
  }
}

$( function() {
    $("input[id|='interest-input']").autocomplete({
      source: "adinterest",
      minLength: 3
    });

    const domContainer = document.querySelector('#react-container');
    ReactDOM.render(React.createElement(ResultList), domContainer);
} );
