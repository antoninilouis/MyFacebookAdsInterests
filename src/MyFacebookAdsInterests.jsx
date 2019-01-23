/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const copyToClipboard = (strs) => {
  const el = document.createElement('textarea');
  el.value = strs.join(', ');
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

const InterestInputList = ({nbInput, inputValues, updateInputValues}) => {
  let l = [];
  for (let index = 0; index < nbInput; index++) {
    let id = 'interest-' + index;
    l.push(
      <div class="form-group">
        <input type="text" class="form-control form-control-sm" placeholder={id} value={inputValues[id]} onChange={updateInputValues} id={id}></input>
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

const InterestList = ({nbList, interests, selectInterest}) => {
  let l = [];
  let len = Object.keys(interests).length;
  let sliceLen = Math.ceil(len / nbList);
  let beg = 0;
  let end = sliceLen;
  let keys = Object.keys(interests);

  shuffle(keys);
  while (beg < len) {
    const slice = keys.slice(beg, end).map((key) => {
      let interest = interests[key]
      return (
        <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" onClick={selectInterest} id={interest.name}>
          {interest.name}
          <span class="badge badge-primary badge-pill">{interest.audience_size.toLocaleString()}</span>
        </a>
      )
    });
    l = l.concat(slice);
    l.push(
      <div>
        <a href="#" onClick={copyToClipboard.bind(null, keys.slice(beg, end))}>Copy</a>
        <br/>
      </div>
    )

    beg += sliceLen;
    end += sliceLen;
  }

  return l;
}

class InterestForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValues: {},
      isLoading: false,
      results: [],
      interests: {},
      nbInput: 3,
      nbList: 1
    };
    this.addSplit = this.addSplit.bind(this);
    this.subSplit = this.subSplit.bind(this);
    this.updateInputValues = this.updateInputValues.bind(this);
    this.selectResult = this.selectResult.bind(this);
    this.selectInterest = this.selectInterest.bind(this);
    this.getResults = this.getResults.bind(this);
    this.aucomplete = React.createRef();
  }

  addSplit(e) {
    if (this.state.nbList < 10) {
      this.setState({
        nbList: this.state.nbList + 1
      })
    }
  }

  subSplit(e) {
    if (this.state.nbList > 0) {
      this.setState({
        nbList: this.state.nbList - 1
      })
    }
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

  selectInterest(e) {
    let interests = this.state.interests;
    delete interests[e.target.id];

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
                <InterestInputList nbInput={this.state.nbInput} inputValues={this.state.inputValues} updateInputValues={this.updateInputValues} />
                <button type="button" class="btn btn-primary btn-sm" onClick={this.getResults}>Search</button>
                <button type="button" class="btn btn-outline-primary btn-sm" onClick={this.addSplit}>+ split</button>
                <button type="button" class="btn btn-outline-primary btn-sm" onClick={this.subSplit}>- split</button>
                <Loader isLoading={this.state.isLoading} />
              </div>
            </form>
            <div class="list-group">
              ({Object.keys(interests).length})
              <InterestList nbList={this.state.nbList} interests={interests} selectInterest={this.selectInterest} />
            </div>
          </div>
          <div class="col-6">
            <div class="list-group">
              ({results.length})
              {results.map((result, index) => {
                if (interests.hasOwnProperty(result.name)) {
                  return (
                    <a href="#" class="list-group-item list-group-item-action active d-flex justify-content-between align-items-center" onClick={this.selectResult} id={index}>
                      {result.name}
                      <span class="badge badge-primary badge-pill">{result.audience_size.toLocaleString()}</span>
                    </a>
                  )
                } else {
                  return (
                    <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" onClick={this.selectResult} id={index}>
                      {result.name}
                      <span class="badge badge-primary badge-pill">{result.audience_size.toLocaleString()}</span>
                    </a>
                  )
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
    ReactDOM.render(<InterestForm />, domContainer);
} );
