import React from 'react';
import PropTypes from 'prop-types';

import MovieItem from '../MovieItem';

import './MovieList.scss';

export default function MoviesList({ movies }) {
  return (
    <ul className="cards">
      {movies.map((movie) => {
        const {
          id,
          originalTitle,
          description,
          posterPath,
          releaseDate,
          voteAverage,
          genres,
          rating,
        } = movie;

        return (
          <MovieItem
            key={id}
            id={id}
            title={originalTitle}
            description={description}
            poster={posterPath}
            release={releaseDate}
            average={voteAverage}
            genres={genres}
            rating={rating}
          />
        );
      })}
    </ul>
  );
}

MoviesList.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
