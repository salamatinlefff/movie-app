const API_KEY = 'bd90935d822d9cdd29ec2d8891aaa89a';
const BASE_URL = 'https://api.themoviedb.org/3';
const LANGUAGE = '&language=en-US';

const GENRES = {
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

const search = ({ query, page = 1 }) => {
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}${LANGUAGE}&query=${query}}&page=${page}&include_adult=false`;
  return getData(url);
};

class TmdbApiService {
  apiKeyGuestSession = '';

  API_KEY = 'bd90935d822d9cdd29ec2d8891aaa89a';

  BASE_URL = 'https://api.themoviedb.org/3';

  BASE_URL_AUTH_GUEST = 'https://api.themoviedb.org/3/authentication/guest_session';

  LANGUAGE = 'language=en-US';

  SORT_BY = 'sort_by=created_at.asc';

  getData = (url) =>
    fetch(url).then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw `Что-то пошло не так, ошибка: ${response.status}`;
    });

  search = ({ query, page = 1 }) => {
    const url = `${this.BASE_URL}/search/movie?api_key=${this.API_KEY}&${this.LANGUAGE}&query=${query}}&page=${page}&include_adult=false`;
    return this.getData(url);
  };

  createGuestSession = () => getData(`${this.BASE_URL_AUTH_GUEST}/new?api_key=${this.API_KEY}`);

  saveGuestSession = async () => {
    if (!localStorage.getItem('guestSession')) {
      const guestData = await this.createGuestSession();

      if (guestData.success) {
        localStorage.setItem('guestSession', guestData.guest_session_id);
      }
    }
    this.apiKeyGuest = localStorage.getItem('guestSession');

    return this.apiKeyGuest;
  };

  rateMovie = async (id, rate) => {
    const body = JSON.stringify({
      value: rate,
    });

    fetch(
      `${BASE_URL}/movie/${id}/rating?api_key=${this.API_KEY}&guest_session_id=${this.apiKeyGuest}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body,
      },
    );
  };

  getRatedMovie = async () => {
    if (!this.apiKeyGuest) await this.saveGuestSession();

    return fetch(
      `https://api.themoviedb.org/3/guest_session/${this.apiKeyGuest}/rated/movies?api_key=${this.API_KEY}&${this.LANGUAGE}&${this.SORT_BY}`,
    ).then((res) => res.json());
  };

  get apiKeyGuest() {
    return this.apiKeyGuestSession;
  }

  set apiKeyGuest(key) {
    this.apiKeyGuestSession = key;
  }
}

export { TmdbApiService, search, GENRES };
