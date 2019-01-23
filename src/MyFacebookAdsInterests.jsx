const InterestInputList = ({nbInput, inputValues, updateInputValues}) => {
  let l = [];
  for (let index = 0; index < nbInput; index++) {
    let id = 'interest-' + index;
    l.push(
      <div class="form-group">
        <input type="text" class="form-control form-control-sm" value={inputValues[id]} onChange={updateInputValues} id={id}></input>
      </div>
    )
  }
  return l;
}

const Loader = ({isLoading}) => {
  if (isLoading) {
    return <img src="static/img/ajax-loader.gif" alt="Loader"></img>;
  }
  return null;
}

class InterestForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValues: {},
      isLoading: false,
      results: [],
      interests: {}
    };
    this.updateInputValues = this.updateInputValues.bind(this);
    this.selectResult = this.selectResult.bind(this);
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

  selectResult(e) {
    let results = this.state.results;
    let interests = this.state.interests;
    const selectedName = results[e.target.id]['name'];

    if (interests.hasOwnProperty(selectedName)) {
      delete interests[selectedName];
    } else {
      interests[selectedName] = results[e.target.id];
    }

    this.setState({
      interests: interests
    });
  }

  getResults() {
    let inputValues = this.state.inputValues;

    $.ajax({
      url: "/result_list",
      method: "POST",
      data: inputValues,
      beforeSend: () => {
        this.setState({isLoading: true});
      },
      complete: () => {
        this.setState({isLoading: false});
      },
      success: (response) => {
        this.setState({results: response});
      }
    });
  }

  componentDidMount() {
    var thisRef = this;
    var node = this.aucomplete.current;
    $(ReactDOM.findDOMNode(node)).find('input').autocomplete({
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
    let interests = this.state.interests;

    return (
      <div>
        <div class="row">
          <div class="col-6">
            <form>
              <div ref={this.aucomplete}>
                <InterestInputList nbInput={this.props.nbInput} inputValues={this.state.inputValues} updateInputValues={this.updateInputValues} />
                <button type="button" class="btn btn-primary btn-sm" onClick={this.getResults}>Search</button>
                <Loader isLoading={this.state.isLoading} />
              </div>
            </form>
            <div class="list-group">
              ({Object.keys(interests).length})
              {Object.keys(interests).map((key,index) => {
                let interest = interests[key]
                return <a href="#" class="list-group-item list-group-item-action" id={index}>{interest.name} ({interest.audience_size})</a>
              })}
            </div>
          </div>
          <div class="col-6">
            <div class="list-group">
              ({results.length})
              {results.map((result, index) => {
                if (interests.hasOwnProperty(result.name)) {
                  return <a href="#" class="list-group-item list-group-item-action active" onClick={this.selectResult} id={index}>{result.name} ({result.audience_size})</a>
                } else {
                  return <a href="#" class="list-group-item list-group-item-action" onClick={this.selectResult} id={index}>{result.name} ({result.audience_size})</a>
                }
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

$( function() {
    const domContainer = document.querySelector('#react-container');
    ReactDOM.render(<InterestForm nbInput="3" />, domContainer);
} );
