import { Pagination } from 'antd';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../Spinner';
import EmptyView from '../EmptyView';
import MovieList from '../MovieList';

import './RatedPage.scss';

export default class RatedPage extends Component {
  static defaultProps = {
    ratedPage: {
      page: 1,
    },
  };

  static propTypes = {
    onChangeRatedPage: PropTypes.func.isRequired,
    getRatedMovies: PropTypes.func.isRequired,
    ratedPage: PropTypes.shape({}),
  };

  componentDidMount() {
    const { onChangeRatedPage, getRatedMovies, ratedPage } = this.props;
    const { page } = ratedPage;

    getRatedMovies({ page });
    onChangeRatedPage({ page });
  }

  onChangePagination = (page) => {
    const { getRatedMovies, onChangeRatedPage } = this.props;

    onChangeRatedPage({ page });

    getRatedMovies({ page });
  };

  render() {
    const { ratedPage } = this.props;

    if (!ratedPage) return null;

    const { movies, total, page, isLoading, isEmpty } = ratedPage;

    const hasData = movies && !(isLoading || isEmpty);

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
      </>
    );
  }
}
