import React from 'react';

import MovieItem from '../MovieItem';
import { GENRES } from '../../services/services';

import './MovieList.scss';

export default function MoviesList({ movies }) {
  return (
    <ul className="cards">
      {movies.map((movie) => {
        const {
          id,
          original_title,
          overview,
          poster_path,
          release_date,
          vote_average,
          genre_ids,
          rating,
        } = movie;

        const genres = genre_ids.map((genreId) => GENRES[genreId]);

        return (
          <MovieItem
            key={id}
            id={id}
            title={original_title}
            description={overview}
            poster={poster_path}
            release={release_date}
            average={vote_average}
            genres={genres}
            rating={rating}
          />
        );
      })}
    </ul>
  );
}
