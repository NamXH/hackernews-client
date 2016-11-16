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
      <div>
        <div>
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
  <div>
    <div>
      <span>Title</span>
      <span>Author</span>
      <span>Comment Count</span>
      <span>Points</span>
    </div>
    { isLoading ?
        <div>Loading ...</div> :
        results[resultKey].hits.map((item, key) =>
          <div key={key}>
            <span><a href={item.url}>{item.title}</a></span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
          </div>
        )
    }
  </div>

const InputConfirm = ({ query, onChange, onSubmit, children }) =>
  <form onSubmit={onSubmit}>
    <input type="text" value={query} onChange={onChange} />
    <button type="submit">{children}</button>
  </form>

export default App;
