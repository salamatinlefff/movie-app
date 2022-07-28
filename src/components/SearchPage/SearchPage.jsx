import React, { Component, createRef } from 'react';
import { Input, Pagination } from 'antd';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';

import './SearchPage.scss';

import MovieList from '../MovieList';
import Spinner from '../Spinner';
import EmptyView from '../EmptyView';

export default class SearchPage extends Component {
  static propTypes = {
    needUpdateSearch: PropTypes.bool.isRequired,
  };

  state = {};

  componentDidMount() {
    this.searchInputRef = createRef();
    this.debounceGetSearchMovies = debounce(this.getSearchMovies, 400);

    const { onCancelUpdatePages } = this.props;
    const page = 1;
    const query = 'return';

    this.setState({
      page,
      query,
      isLoading: false,
      hasError: false,
      canUpdate: false,
    });

    this.getSearchMovies({ query, page });

    this.setState({ canUpdate: true });

    onCancelUpdatePages();
  }

  componentDidUpdate(prevProps, prevState) {
    const { needUpdateSearch, onCancelUpdatePages } = this.props;
    const { page, query } = this.state;
    const { isLoading, canUpdate } = prevState;

    if (this.searchInputRef) this.searchInputRef.current.focus();

    if (needUpdateSearch && !isLoading && canUpdate) {
      this.getSearchMovies({ query, page });

      onCancelUpdatePages();
    }
  }

  getSearchMovies = async ({ query, page }) => {
    const { services } = this.props;

    this.setState({
      isLoading: true,
      hasError: false,
    });

    try {
      const res = await services.tmdbApiService.search({
        query: encodeURIComponent(query).trim(),
        page,
      });

      this.setState({
        page,
        movies: this.filteredMovie(res.results),
        total: res.total_results,
        isEmpty: !res.results.length,
      });
    } catch (err) {
      this.setState({
        hasError: true,
        page: 1,
        movies: null,
        total: null,
        isEmpty: false,
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  filteredMovie = (searchMovies) => {
    const { services } = this.props;

    const ratedMovies = services.localStorageService.loadLocalRated();

    return [...searchMovies].reduce((res, movie) => {
      ratedMovies.forEach((rated) => {
        if (rated.id === movie.id) {
          movie.rating = rated.rating;
        }
      });

      res.push(movie);

      return res;
    }, []);
  };

  onChangePagination = (page) => {
    const { query } = this.state;

    this.getSearchMovies({ query, page });
  };

  onChangeSearchInput = ({ target: { value } }) => {
    const { query } = this.state;

    this.setState({
      query: value,
    });

    if (query.trim() === '' && value.trim() === '') return this.setState({ isEmpty: true });
    if (query.trim() === value.trim()) return null;

    this.debounceGetSearchMovies({ query: value, page: 1 });
  };

  render() {
    const { movies, query, total, page, isLoading, isEmpty, hasError } = this.state;

    const hasData = movies && !(isLoading || isEmpty);

    const textError = 'Connection to server failed... Please try again later';

    return (
      <>
        <Input
          ref={this.searchInputRef}
          placeholder="Type to search..."
          allowClear
          value={query}
          onChange={this.onChangeSearchInput}
        />

        {isLoading && <Spinner />}
        {isEmpty && <EmptyView />}

        {hasData && <MovieList movies={movies} />}
        {hasData && (
          <Pagination
            showQuickJumper
            size="small"
            pageSize={20}
            showSizeChanger={false}
            total={total}
            onChange={this.onChangePagination}
            current={page}
          />
        )}

        {hasError && <EmptyView label={textError} />}
      </>
    );
  }
}
