import { Rate } from 'antd';
import React from 'react';

import ItemLabel from '../item-label';

import './movies-list-item.scss';

export default function MoviesListItem({ url }) {
  return (
    <li className="cards__item item">
      <div className="item__poster">
        <img className="item__img" width={183} height={280} src={url} alt="poster" />
      </div>

      <div className="item__about">
        <span className="item__grade">6.6</span>
        <h2 className="item__title">The way back</h2>

        <span className="item__release-time">March 5, 2020 </span>

        <ul className="item__labels labels">
          <li className="labels-item">
            <ItemLabel label="Action" />
          </li>
          <ItemLabel label="Drama" />
        </ul>

        <p className="item__description">
          A former basketball all-star, who has lost his wife and family foundation in a struggle
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iure repellendus quae labore
          ratione esse voluptatibus, hic in cupiditate molestiae illum, consectetur sed. Deleniti
          adipisci odit in magni quisquam ex accusantium.
        </p>

        <Rate className="item__stars" allowHalf defaultValue={2.5} count={10} />
      </div>
    </li>
  );
}
