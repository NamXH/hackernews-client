import React, { Component } from 'react';
import './App.css';

const BASE_QUERY = 'https://hn.algolia.com/api/v1/';
const SEARCH_QUERY = 'search?query=';

class App extends Component {

  constructor() {
    super();

    this.state = {
      hits: [],
      page: null,
      hitsPerPage: 0,
      query: 'redux',
      isLoading: true,
    };

    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  setSearchTopstories({ hits, page, hitsPerPage }) {
    this.setState({ hits, page, hitsPerPage, isLoading: false })
  }

  fetchSearchTopstories(query) {
    this.setState({ isLoading: true });
    fetch(`${BASE_QUERY}${SEARCH_QUERY}${query}`)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result));
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
    const { hits, query, isLoading } = this.state;

    return (
      <div>
        <form onSubmit={this.onSearchSubmit}>
          <input type="text" value={query} onChange={this.onSearchChange} />
          <button type="submit">Search</button>
        </form>
        <div>
          <span>Title</span>
          <span>Author</span>
          <span>Comment Count</span>
          <span>Points</span>
        </div>
        { isLoading ?
            <div>Loading ...</div> :
            hits.map((item, key) =>
              <div key={key}>
                <span><a href={item.url}>{item.title}</a></span>
                <span>{item.author}</span>
                <span>{item.num_comments}</span>
                <span>{item.points}</span>
              </div>
            )
        }
      </div>
    );
  }
}

export default App;
