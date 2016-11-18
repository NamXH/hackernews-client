import React, { Component } from 'react';
import './App.css';

const BASE_QUERY = 'https://hn.algolia.com/api/v1/';
const SEARCH_QUERY = 'search?query=';

class App extends Component {

  constructor() {
    super();

    this.state = {
      results: {},
      query: 'redux',
      resultKey: '',
      isLoading: true,
    };

    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  setSearchTopstories(result, query) {
    const { hits, page, hitsPerPage } = result;
    const { results } = this.state;
    this.setState({
      results: { ...results, [query]: { hits, page, hitsPerPage } },
      resultKey: query,
      isLoading: false
    });
  }

  fetchSearchTopstories(query) {
    if (this.state.results[query]) {
      this.setState({ resultKey: query });
      return;
    }

    this.setState({ isLoading: true });

    fetch(`${BASE_QUERY}${SEARCH_QUERY}${query}`)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result, query));
  }

  onSearchChange(event) {
    this.setState({ query: event.target.value });
  }

  onSearchSubmit(event) {
    this.fetchSearchTopstories(this.state.query);
    event.preventDefault();
  }

  componentDidMount() {
    const { query } = this.state;
    this.fetchSearchTopstories(query);
  }

  render() {
    const { results, resultKey, query, isLoading } = this.state;

    return (
      <div className="page">
        <div className="search">
          <InputConfirm query={query} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>
            Search
          </InputConfirm>
        </div>
        <div>
          <HitsTable results={results} resultKey={resultKey} isLoading={isLoading} />
        </div>
      </div>
    );
  }
}

const HitsTable = ({ results, resultKey, isLoading }) =>
  <div className="table">
    <div className="table-header">
      <span style={{ width: '40%' }}>Title</span>
      <span style={{ width: '30%' }}>Author</span>
      <span style={{ width: '15%' }}>Comments</span>
      <span style={{ width: '15%' }}>Points</span>
    </div>
    <div>
      { isLoading ?
          <div className="table-empty">Loading ...</div> :
          results[resultKey].hits.map((item, key) =>
            <div className="table-row" key={key}>
              <span style={{ width: '40%' }}><a href={item.url}>{item.title}</a></span>
              <span style={{ width: '30%' }}>{item.author}</span>
              <span style={{ width: '15%' }}>{item.num_comments}</span>
              <span style={{ width: '15%' }}>{item.points}</span>
            </div>
          )
      }
    </div>
  </div>

const InputConfirm = ({ query, onChange, onSubmit, children }) =>
  <form onSubmit={onSubmit}>
    <input type="text" value={query} onChange={onChange} />
    <button type="submit">{children}</button>
  </form>

export default App;
