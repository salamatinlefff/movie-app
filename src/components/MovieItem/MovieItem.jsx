import { Rate } from 'antd';
import { format } from 'date-fns';
import React, { createRef, useEffect, useState } from 'react';
import TextTruncate from 'react-text-truncate';

import './MovieItem.scss';

import ItemLabel from '../ItemLabel';
import { TmdbApiServiceConsumer } from '../TmdbApiContext';
import { averageColor } from '../../utils';
import { saveLocalRated } from '../../services';

export default function MoviesListItem({
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
        <span className="item__grade" style={{ borderColor: averageColor(average) }}>
          {parseFloat(average).toFixed(1) || 'N/A'}
        </span>
        <h2 className="item__title">{title || 'N/A'}</h2>

        <span className="item__release-time">
          {(release && format(new Date(release), 'LLLL d, y')) || 'N/A'}
        </span>

        <ul className="item__labels labels">
          {genres.length ? (
            genres.map((genre) => (
              <li className="labels-item" key={genre}>
                <ItemLabel label={genre} />
              </li>
            ))
          ) : (
            <li className="labels-item" key="N/A">
              <ItemLabel label="N/A" />
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
          {({ rateMovie }) => (
            <Rate
              className="item__stars"
              allowHalf
              onChange={(rate) => {
                rateMovie(id, rate);
                saveLocalRated({
                  id,
                  rating: rate,
                });
              }}
              defaultValue={rating || 0}
              count={10}
            />
          )}
        </TmdbApiServiceConsumer>
      </div>
    </li>
  );
}
