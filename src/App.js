import React, { Component } from 'react';
import { sortBy, map } from 'lodash';
import classNames from 'classnames';
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
  COMMENTS: items => sortBy(items, 'num_comments').reverse(),
  POINTS: items => sortBy(items, 'points').reverse(),
};

class App extends Component {

  constructor() {
    super();

    this.state = {
      results: {},
      query: DEFAULT_QUERY,
      resultKey: '',
      isLoading: false,
      sortKey: 'NONE',
      isSortReverse: false,
    };

    this.setSearchTopstories = this.setSearchTopstories.bind(this);
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
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
    event.preventDefault();
  }

  componentDidMount() {
    if(this.needsToFetchSearchTopstories()) {
      this.fetchSearchTopstories();
    }
  }

  render() {
    const { results, resultKey, query, isLoading, sortKey, isSortReverse } = this.state;
    const page = (results[resultKey] && results[resultKey].page) || 0;

    return (
      <div className="page">
        <div className="interactions">
          <InputConfirm query={query} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>
            Search
          </InputConfirm>
        </div>
        <div>
          <HitsTable
            results={results}
            resultKey={resultKey}
            sortKey={sortKey}
            onSort={this.onSort}
            isSortReverse={isSortReverse}
          />
        </div>
        <div className="interactions">
          <MoreButtonWithLoading
            isLoading={isLoading}
            onClick={this.fetchSearchTopstories}
            resultKey={resultKey}
            page={page}>
            More
          </MoreButtonWithLoading>
        </div>
      </div>
    );
  }
}

const HitsTable = ({ results, resultKey, sortKey, isSortReverse, onSort }) => {
  const hits = (results[resultKey] && results[resultKey].hits) || [];
  const sortedHits = SORTS[sortKey](hits);
  const reverseSortedHits = isSortReverse ? sortedHits.reverse() : sortedHits;

  return (
    <div className="table">
      <div className="table-header">
        <span style={{ width: '40%' }}>
          <Sort sortKey={'TITLE'} activeSortKey={sortKey} onSort={onSort}>Title</Sort>
        </span>
        <span style={{ width: '30%' }}>
          <Sort sortKey={'AUTHOR'} activeSortKey={sortKey} onSort={onSort}>Author</Sort>
        </span>
        <span style={{ width: '15%' }}>
          <Sort sortKey={'COMMENTS'} activeSortKey={sortKey} onSort={onSort}>Comments</Sort>
        </span>
        <span style={{ width: '15%' }}>
          <Sort sortKey={'POINTS'} activeSortKey={sortKey} onSort={onSort}>Points</Sort>
        </span>
      </div>
      <div>
        { map(reverseSortedHits, (item, key) =>
          <div className="table-row" key={key}>
            <span style={{ width: '40%' }}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={{ width: '30%' }}>
              {item.author}
            </span>
            <span style={{ width: '15%' }}>
              {item.num_comments}
            </span>
            <span style={{ width: '15%' }}>
              {item.points}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

const Sort = ({ onSort, sortKey, activeSortKey, children }) => {
  const sortClass = classNames('button-inline', { 'button-active': sortKey === activeSortKey });

  return (
    <button onClick={() => onSort(sortKey)} className={sortClass} type="button">
      {children}
    </button>
  );
}

const MoreButton = ({ onClick, resultKey, page, children }) =>
  <button onClick={() => onClick(resultKey, page + 1)} type="button">
    {children}
  </button>

const withLoading = (Component) => ({ isLoading, ...props }) =>
  isLoading ? <Loading /> : <Component { ...props } />;

const Loading = () =>
  <div>Loading ...</div>

const MoreButtonWithLoading = withLoading(MoreButton);

const InputConfirm = ({ query, onChange, onSubmit, children }) =>
  <form onSubmit={onSubmit}>
    <input type="text" value={query} onChange={onChange} />
    <button type="submit">{children}</button>
  </form>

export default App;

export {
  InputConfirm,
  MoreButton,
  Sort,
  HitsTable,
};
