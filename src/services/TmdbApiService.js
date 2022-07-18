class TmdbApiService {
  apiKeyGuestSession = '';

  BASE_URL_AUTH_GUEST = 'https://api.themoviedb.org/3/authentication/guest_session';

  API_KEY = 'bd90935d822d9cdd29ec2d8891aaa89a';

  BASE_URL = 'https://api.themoviedb.org/3';

  LANGUAGE = 'language=en-US';

  SORT_BY = 'sort_by=created_at.asc';

  GENRES = {
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

  getData = async (url) => {
    const response = await fetch(url);

    if (!response.ok) throw new Error(`Что-то пошло не так, ошибка: ${response.status}`);

    const data = await response.json();

    this.transformData(data.results);

    return data;
  };

  search = async ({ query, page = 1 }) => {
    const url = `${this.BASE_URL}/search/movie?api_key=${this.API_KEY}&${this.LANGUAGE}&query=${query}}&page=${page}&include_adult=false`;

    return this.getData(url);
  };

  getRatedMovie = async () => {
    if (!this.apiKeyGuest) await this.saveGuestSession();

    const url = `https://api.themoviedb.org/3/guest_session/${this.apiKeyGuest}/rated/movies?api_key=${this.API_KEY}&${this.LANGUAGE}&${this.SORT_BY}`;

    return this.getData(url);
  };

  rateMovie = async (id, rate) => {
    fetch(
      `${this.BASE_URL}/movie/${id}/rating?api_key=${this.API_KEY}&guest_session_id=${this.apiKeyGuest}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          value: rate,
        }),
      },
    );
  };

  createGuestSession = () =>
    this.getData(`${this.BASE_URL_AUTH_GUEST}/new?api_key=${this.API_KEY}`);

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

  transformGenres = (arr) => arr.map((genre) => this.GENRES[genre]);

  transformData = (items) => {
    [...items].map((item) => {
      item.genres = this.transformGenres(item.genre_ids);

      delete item.genre_ids;

      return item;
    });
  };

  get apiKeyGuest() {
    return this.apiKeyGuestSession;
  }

  set apiKeyGuest(key) {
    this.apiKeyGuestSession = key;
  }
}

export { TmdbApiService };
