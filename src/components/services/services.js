const API_KEY = 'bd90935d822d9cdd29ec2d8891aaa89a';
const BASE_URL = 'https://api.themoviedb.org/3/';
const LANGUAGE = '&language=en-US';

export const GENRES = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

const getData = (url) =>
  fetch(url).then((response) => {
    if (response.ok) {
      return response.json();
    }

    throw `Что-то пошло не так, ошибка: ${response.status}`;
  });

export const search = ({ query, page = 1 }) => {
  const url = `${BASE_URL}search/movie?api_key=${API_KEY}${LANGUAGE}&query=${query}}&page=${page}&include_adult=false`;
  return getData(url);
};

export const debounce = (fn, delay) => {
  let timeout;

  return function wrapper(...args) {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};
