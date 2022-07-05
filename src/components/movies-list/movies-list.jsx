import React from 'react';

import MoviesListItem from '../movies-list-item';

import './movies-list.scss';

export default function MoviesList({ url }) {
  return (
    <ul className="cards">
      <MoviesListItem url={url} />
      <MoviesListItem url={url} />
      <MoviesListItem url={url} />
      <MoviesListItem url={url} />
    </ul>
  );
}
