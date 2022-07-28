import './RatedPage.scss';

import { Pagination } from 'antd';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../Spinner';
import EmptyView from '../EmptyView';
import MovieList from '../MovieList';

export default class RatedPage extends Component {
  static propTypes = {
    needUpdateRated: PropTypes.bool.isRequired,
  };

  state = {};

  componentDidMount() {
    const { onCancelUpdatePages } = this.props;
    const page = 1;

    this.setState({
      page,
      isLoading: false,
      hasError: false,
      canUpdate: false,
    });

    this.getRatedMovies({ page });

    this.setState({ canUpdate: true });

    onCancelUpdatePages();
  }

  componentDidUpdate(prevProps, prevState) {
    const { needUpdateRated, onCancelUpdatePages } = this.props;
    const { page } = this.state;
    const { isLoading, canUpdate } = prevState;

    if (needUpdateRated && !isLoading && canUpdate) {
      this.getRatedMovies({ page });

      onCancelUpdatePages();
    }
  }

  getRatedMovies = async ({ page }) => {
    const { services } = this.props;

    this.setState({
      page,
      isLoading: true,
      hasError: false,
    });

    try {
      const res = await services.tmdbApiService.getRatedMovie({ page });

      this.setState({
        page: res.page,
        movies: res.results,
        total: res.total_results,
        isEmpty: !res.results.length,
      });
    } catch {
      this.setState({ hasError: true, page: 1, movies: null, total: null, isEmpty: false });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  onChangePagination = (page) => {
    this.setState({ page });

    this.getRatedMovies({ page });
  };

  render() {
    const { isLoading, hasError, page, movies, total, isEmpty } = this.state;

    const hasData = movies && !(isLoading || isEmpty);

    const textError = 'Connection to server failed... Please try again later';

    return (
      <>
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
