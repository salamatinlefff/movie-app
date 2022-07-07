import React from 'react';

import MoviesListItem from '../MoviesListItem';
import { GENRES } from '../services/services';

import './MoviesList.scss';

export default function MoviesList({ movies }) {
  return (
    <ul className="cards">
      {movies.map((movie) => {
        const { id, original_title, overview, poster_path, release_date, vote_average, genre_ids } =
          movie;

        const genres = genre_ids.map((genreId) => GENRES[genreId]);

        return (
          <MoviesListItem
            key={id}
            title={original_title}
            description={overview}
            poster={poster_path}
            release={release_date}
            average={vote_average}
            genres={genres}
          />
        );
      })}
    </ul>
  );
}
