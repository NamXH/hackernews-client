import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';

import App from './App';
import { InputConfirm, MoreButton, Sort, HitsTable } from './App'

describe('App', () => {

  it('renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });

});

describe('InputConfirm', () => {

  it('renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(<InputConfirm>Confirm Me</InputConfirm>, div);
  });

});

describe('Sort', () => {

  it('renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Sort>Sort Me</Sort>, div);
  });

});

describe('MoreButton', () => {

  it('renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(<MoreButton>Give Me More</MoreButton>, div);
  });

});

describe('HitsTable', () => {

  const props = {
    results: {
      someResultKey: {
        hits: [
          { title: 'a', author: 'b', num_comments: 1, points: 2 }
        ],
      }
    },
    resultKey: 'someResultKey',
    sortKey: 'NONE',
  };

  it('renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(<HitsTable { ...props } />, div);
  });

});