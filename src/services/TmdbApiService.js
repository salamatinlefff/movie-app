class TmdbApiService {
  apiKeyGuestSession = '';

  BASE_URL_AUTH_GUEST = 'https://api.themoviedb.org/3/authentication/guest_session';

  API_KEY = 'bd90935d822d9cdd29ec2d8891aaa89a';

  BASE_URL = 'https://api.themoviedb.org/3';

  LANGUAGE = 'language=en-US';

  SORT_BY = 'sort_by=created_at.asc';

  getData = async (url) => {
    let data;
    try {
      if (!this.apiKeyGuest) await this.saveGuestSession();
      if (!this.genres) this.genres = await this.getGenres();

      const response = await fetch(url);

      if (!response.ok) throw new Error(`Something wrong, error: ${response.status}`);

      data = await response.json();
    } catch (err) {
      throw new Error(`Something wrong, error: ${err}`);
    }

    data.results = this.transformData(data.results);

    return data;
  };

  search = async ({ query, page }) => {
    const url = `${this.BASE_URL}/search/movie?api_key=${this.API_KEY}&${this.LANGUAGE}&query=${query}}&page=${page}&include_adult=false`;

    return this.getData(url);
  };

  getRatedMovie = async ({ page }) => {
    if (!this.apiKeyGuest) await this.saveGuestSession();

    const url = `https://api.themoviedb.org/3/guest_session/${this.apiKeyGuest}/rated/movies?api_key=${this.API_KEY}&${this.LANGUAGE}&page=${page}&${this.SORT_BY}`;

    return this.getData(url);
  };

  rateMovie = async (id, rate) => {
    if (!this.apiKeyGuest) await this.saveGuestSession();

    const response = await fetch(
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

    if (!response.ok) throw new Error(`Something wrong, error: ${response.status}`);
  };

  createGuestSession = () => fetch(`${this.BASE_URL_AUTH_GUEST}/new?api_key=${this.API_KEY}`);

  saveGuestSession = async () => {
    if (!localStorage.getItem('guestSession')) {
      let guestData;
      const response = await this.createGuestSession();

      if (response.ok) {
        guestData = await response.json();

        if (guestData.success) {
          localStorage.setItem('rated-movies', []);
          localStorage.setItem('guestSession', guestData.guest_session_id);
        }
      }
    }
    this.apiKeyGuest = localStorage.getItem('guestSession');

    return this.apiKeyGuest;
  };

  getGenres = async () => {
    try {
      const res = await fetch(
        'https://api.themoviedb.org/3/genre/movie/list?api_key=bd90935d822d9cdd29ec2d8891aaa89a&language=en-US',
      );

      if (!res.ok) throw new Error(`Something wrong, error: ${res.status}`);

      const data = await res.json();

      return data.genres;
    } catch (err) {
      throw new Error(`Something wrong, error: ${err}`);
    }
  };

  transformGenres = (arr) =>
    arr.map((item) => {
      let newItem;
      this.genres.forEach((genre) => {
        if (genre.id === item) {
          newItem = genre.name;
        }
      });

      return newItem;
    });

  transformData = (items) =>
    [...items].map((item) => ({
      genres: this.transformGenres(item.genre_ids),
      id: item.id,
      originalTitle: item.original_title,
      description: item.overview,
      posterPath: item.poster_path,
      releaseDate: item.release_date,
      voteAverage: item.vote_average,
      rating: item.rating,
    }));

  get apiKeyGuest() {
    return this.apiKeyGuestSession;
  }

  set apiKeyGuest(key) {
    this.apiKeyGuestSession = key;
  }
}

export { TmdbApiService };
