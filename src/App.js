import React, { Component } from 'react';
import './App.css';

const QUERY_DEFAULT = 'redux';
const HPP_DEFAULT = '100';

const BASE_PATH = 'https://hn.algolia.com/api/v1';
const SEARCH_PATH = '/search';
const SEARCH_PARAM = 'query=';
const PAGE_PARAM = 'page=';
const HPP_PARAM = 'hitsPerPage=';

class App extends Component {

  constructor() {
    super();

    this.state = {
      results: {},
      query: '',
      resultKey: '',
      isLoading: false,
    };

    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.needsToFetchSearchTopstories = this.needsToFetchSearchTopstories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  setSearchTopstories(result, query) {
    const { hits, page } = result;
    const { results } = this.state;

    const oldHits = page === 0 ? [] : results[query].hits;
    const updatedHits = [ ...oldHits, ...hits ];

    this.setState({
      results: { ...results, [query]: { hits: updatedHits, page } },
      isLoading: false
    });
  }

  fetchSearchTopstories(query = QUERY_DEFAULT, page = 0) {
    this.setState({ isLoading: true });

    fetch(`${BASE_PATH}${SEARCH_PATH}?${SEARCH_PARAM}${query}&${PAGE_PARAM}${page}&${HPP_PARAM}${HPP_DEFAULT}`)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result, query));
  }

  onSearchChange(event) {
    this.setState({ query: event.target.value });
  }

  needsToFetchSearchTopstories(query = QUERY_DEFAULT) {
    this.setState({ resultKey: query });
    return !this.state.results[query];
  }

  onSearchSubmit(event) {
    const { query } = this.state;
    if(this.needsToFetchSearchTopstories(query)) {
      this.fetchSearchTopstories(query);
    }
    event.preventDefault();
  }

  componentDidMount() {
    if(this.needsToFetchSearchTopstories()) {
      this.fetchSearchTopstories();
    }
  }

  render() {
    const { results, resultKey, query, isLoading } = this.state;
    const page = (results[resultKey] && results[resultKey].page) || 0;

    return (
      <div className="page">
        <div className="interactions">
          <InputConfirm query={query} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>
            Search
          </InputConfirm>
        </div>
        <div>
          <HitsTable results={results} resultKey={resultKey} />
        </div>
        <div className="interactions">
          { isLoading ?
            <div>Loading ...</div> :
            <MoreButton onClick={this.fetchSearchTopstories} resultKey={resultKey} page={page}>
              More
            </MoreButton>
          }
        </div>
      </div>
    );
  }
}

const HitsTable = ({ results, resultKey }) =>
  <div className="table">
    <div className="table-header">
      <span style={{ width: '40%' }}>Title</span>
      <span style={{ width: '30%' }}>Author</span>
      <span style={{ width: '15%' }}>Comments</span>
      <span style={{ width: '15%' }}>Points</span>
    </div>
    <div>
      { results[resultKey] &&
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

const MoreButton = ({ onClick, resultKey, page, children }) =>
  <button onClick={() => onClick(resultKey, page + 1)} type="button">
    {children}
  </button>

const InputConfirm = ({ query, onChange, onSubmit, children }) =>
  <form onSubmit={onSubmit}>
    <input type="text" value={query} onChange={onChange} />
    <button type="submit">{children}</button>
  </form>

export default App;
