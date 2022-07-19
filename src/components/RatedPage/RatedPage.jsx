import { Pagination } from 'antd';
import React, { Component } from 'react';

import Spinner from '../Spinner';
import EmptyIndicator from '../EmptyIndicator';
import MovieList from '../MovieList';

import './RatedPage.scss';

export default class RatedPage extends Component {
  onChangePagination = (page) => {
    const { getMovie } = this.props;

    getMovie({ page });
  };

  render() {
    const { ratedPage } = this.props;

    if (!ratedPage) return null;

    const { movies, total, page, isLoading, isEmpty } = ratedPage;

    const hasData = movies && !(isLoading || isEmpty);
    const emptyTrigger = isEmpty;

    return (
      <>
        {isLoading && <Spinner />}
        {emptyTrigger && <EmptyIndicator />}

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
