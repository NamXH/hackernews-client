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

  test('snapshots', () => {
    const component = renderer.create(
      <App />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

describe('InputConfirm', () => {

  it('renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(<InputConfirm>Confirm Me</InputConfirm>, div);
  });

  test('snapshots', () => {
    const component = renderer.create(
      <InputConfirm>Confirm Me</InputConfirm>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

describe('Sort', () => {

  it('renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Sort>Sort Me</Sort>, div);
  });

  test('snapshots', () => {
    const component = renderer.create(
      <Sort>Sort Me</Sort>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

describe('MoreButton', () => {

  it('renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(<MoreButton>Give Me More</MoreButton>, div);
  });

  test('snapshots', () => {
    const component = renderer.create(
      <MoreButton>Give Me More</MoreButton>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
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

  test('snapshots', () => {
    const component = renderer.create(
      <HitsTable { ...props } />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});