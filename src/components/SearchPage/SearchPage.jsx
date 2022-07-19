import React, { Component, createRef } from 'react';
import { Input, Pagination } from 'antd';
import { debounce } from 'lodash';

import './SearchPage.scss';

import MovieList from '../MovieList';
import Spinner from '../Spinner';
import EmptyIndicator from '../EmptyIndicator';

export default class SearchPage extends Component {
  searchInputRef = createRef();

  debounceSendRequest = debounce(this.props.sendRequest, 400);

  componentDidMount() {
    const { onChangeSearchPage, sendRequest } = this.props;

    const query = 'return';
    const page = 1;

    sendRequest({ query, page });
    onChangeSearchPage({ query, page });
  }

  componentDidUpdate() {
    if (this.searchInputRef) this.searchInputRef.current.focus();
  }

  onChangePagination = (page) => {
    const {
      searchPage: { query },
      sendRequest,
    } = this.props;

    sendRequest({ query, page });
  };

  onChangeSearchInput = ({ target: { value } }) => {
    const {
      searchPage: { query, page },
    } = this.props;

    const { onChangeSearchPage } = this.props;

    onChangeSearchPage({
      query: value,
    });

    if (query.trim() === '' && value.trim() === '') return onChangeSearchPage({ isEmpty: true });
    if (query.trim() === value.trim()) return null;

    this.debounceSendRequest({ query: value, page });
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
        {isEmpty && <EmptyIndicator />}

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
