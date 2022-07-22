import { Rate } from 'antd';
import { format } from 'date-fns';
import React, { createRef, useEffect, useState } from 'react';
import TextTruncate from 'react-text-truncate';
import PropTypes from 'prop-types';

import './MovieItem.scss';

import { TmdbApiServiceConsumer } from '../TmdbApiContext';
import AverageRate from '../AverageRate';

export default function MoviesItem({
  id,
  title,
  description,
  poster,
  release,
  average,
  genres,
  rating,
}) {
  const descriptionRef = createRef();

  const [descrHeight, setDescrHeight] = useState(0);

  useEffect(() => {
    const height = descriptionRef.current.clientHeight;

    setDescrHeight(height);
  }, []);

  return (
    <li className="cards__item item">
      <div className="item__poster">
        <img
          className="item__img"
          width={183}
          height={280}
          src={
            (poster && `https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${poster}`) ||
            'https://i.ibb.co/LZk1YQZ/poster-holder.jpg'
          }
          alt="poster"
        />
      </div>

      <div className="item__about">
        <AverageRate average={average} />
        <h2 className="item__title">{title || 'N/A'}</h2>

        <span className="item__release-time">
          {(release && format(new Date(release), 'LLLL d, y')) || 'N/A'}
        </span>

        <ul className="item__labels labels">
          {genres.length ? (
            genres.map((genre) => (
              <li className="labels-item" key={genre}>
                <span className="item__label">{genre}</span>
              </li>
            ))
          ) : (
            <li className="labels-item" key="N/A">
              <span className="item__label">N/A</span>
            </li>
          )}
        </ul>

        <div className="item__description" ref={descriptionRef}>
          <TextTruncate
            line={Math.floor(descrHeight / 22)}
            truncateText="…"
            text={description || 'N/A'}
          />
        </div>

        <TmdbApiServiceConsumer>
          {({ tmdbApiService, localStorageService }) => (
            <Rate
              className="item__stars"
              allowHalf
              onChange={(rate) => {
                tmdbApiService.rateMovie(id, rate);
                localStorageService.saveLocalRated({
                  id,
                  rating: rate,
                });
              }}
              defaultValue={rating}
              count={10}
            />
          )}
        </TmdbApiServiceConsumer>
      </div>
    </li>
  );
}

MoviesItem.defaultProps = {
  rating: 0,
};

MoviesItem.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  poster: PropTypes.string.isRequired,
  release: PropTypes.string.isRequired,
  average: PropTypes.number.isRequired,
  genres: PropTypes.arrayOf(PropTypes.string).isRequired,
  rating: PropTypes.number,
};
