import React, { Component, createRef } from 'react';
import { Input, Pagination } from 'antd';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';

import './SearchPage.scss';

import MovieList from '../MovieList';
import Spinner from '../Spinner';
import EmptyView from '../EmptyView';

export default class SearchPage extends Component {
  static defaultProps = {
    searchPage: {
      query: 'return',
      page: 1,
    },
  };

  static propTypes = {
    onChangeSearchPage: PropTypes.func.isRequired,
    getSearchMovies: PropTypes.func.isRequired,
    searchPage: PropTypes.shape({}),
  };

  searchInputRef = createRef();

  debounceGetSearchMovies = debounce(this.props.getSearchMovies, 400);

  componentDidMount() {
    const { onChangeSearchPage, getSearchMovies, searchPage } = this.props;
    const { query, page } = searchPage;
    getSearchMovies({ query, page });
    onChangeSearchPage({ query, page });
  }

  componentDidUpdate() {
    if (this.searchInputRef) this.searchInputRef.current.focus();
  }

  onChangePagination = (page) => {
    const {
      searchPage: { query },
      getSearchMovies,
    } = this.props;

    getSearchMovies({ query, page });
  };

  onChangeSearchInput = ({ target: { value } }) => {
    const {
      searchPage: { query },
    } = this.props;

    const { onChangeSearchPage } = this.props;

    onChangeSearchPage({
      query: value,
    });

    if (query.trim() === '' && value.trim() === '') return onChangeSearchPage({ isEmpty: true });
    if (query.trim() === value.trim()) return null;

    this.debounceGetSearchMovies({ query: value, page: 1 });
  };

  render() {
    const { searchPage } = this.props;

    if (!searchPage) return <Spinner />;

    const { movies, query, total, page, isLoading, isEmpty } = searchPage;

    const hasData = movies && !(isLoading || isEmpty);

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
      </>
    );
  }
}
