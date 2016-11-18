import React, { Component } from 'react';
import { sortBy, map } from 'lodash';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const SORTS = {
  NONE: items => items,
  TITLE: items => sortBy(items, 'title'),
  AUTHOR: items => sortBy(items, 'author'),
  COMMENTS: items => sortBy(items, 'num_comments'),
  POINTS: items => sortBy(items, 'points'),
};

class App extends Component {

  constructor() {
    super();

    this.state = {
      results: {},
      query: '',
      resultKey: '',
      isLoading: false,
      sortKey: 'NONE',
    };

    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.needsToFetchSearchTopstories = this.needsToFetchSearchTopstories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSort = this.onSort.bind(this);
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

  fetchSearchTopstories(query = DEFAULT_QUERY, page = 0) {
    this.setState({ isLoading: true });

    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${query}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result, query));
  }

  onSearchChange(event) {
    this.setState({ query: event.target.value });
  }

  needsToFetchSearchTopstories(query = DEFAULT_QUERY) {
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

  onSort(sortKey) {
    this.setState({ sortKey });
    event.preventDefault();
  }

  componentDidMount() {
    if(this.needsToFetchSearchTopstories()) {
      this.fetchSearchTopstories();
    }
  }

  render() {
    const { results, resultKey, query, isLoading, sortKey } = this.state;
    const page = (results[resultKey] && results[resultKey].page) || 0;

    return (
      <div className="page">
        <div className="interactions">
          <InputConfirm query={query} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>
            Search
          </InputConfirm>
        </div>
        <div>
          <HitsTable results={results} resultKey={resultKey} sortKey={sortKey} onSort={this.onSort} />
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

const HitsTable = ({ results, resultKey, sortKey, onSort }) =>
  <div className="table">
    <div className="table-header">
      <span style={{ width: '40%' }}>
        <Sort onSort={() => onSort('TITLE')}>Title</Sort>
      </span>
      <span style={{ width: '30%' }}>
        <Sort onSort={() => onSort('AUTHOR')}>Author</Sort>
      </span>
      <span style={{ width: '15%' }}>
        <Sort onSort={() => onSort('COMMENTS')}>Comments</Sort>
      </span>
      <span style={{ width: '15%' }}>
        <Sort onSort={() => onSort('POINTS')}>Points</Sort>
      </span>
    </div>
    <div>
      { results[resultKey] &&
          map(SORTS[sortKey](results[resultKey].hits), (item, key) =>
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

const Sort = ({ onSort, children }) =>
  <button onClick={onSort} className="button-inline" type="button">
    {children}
  </button>

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
