import { Empty, Input, Layout, Pagination, Tabs } from 'antd';
import Loader from 'react-js-loader';
import { debounce } from 'lodash';
import React, { Component, createRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import MovieList from '../MovieList';
import { TmdbApiService } from '../../services/TmdbApiService';
import { TmdbApiServiceProvider } from '../../tmdbApiContext';

import emptyLogo from './empty.svg';

import 'react-toastify/dist/ReactToastify.css';
import './App.scss';

const { TabPane } = Tabs;

class App extends Component {
  state = { isLoading: false, rated: { ratedMovie: [] } };

  tmdbApiService = new TmdbApiService();

  searchInputRef = createRef();

  debounceSendRequest = debounce(this.sendRequest, 400);

  componentDidMount() {
    const value = 'return';

    this.setState({
      isLoading: true,
      query: value,
      movies: [],
      page: null,
      total: null,
      rated: { ratedMovie: [], ratedTotal: null, ratedPage: null, ratedIsEmpty: null },
      hasError: null,
      isEmpty: null,
      isOffline: null,
    });

    window.addEventListener('offline', () => {
      toast.error('Connection lost');

      this.setState({
        isOffline: true,
      });
    });

    window.addEventListener('online', () => {
      toast.success('Connection restored');

      this.setState({
        isOffline: false,
      });
    });

    this.tmdbApiService.saveGuestSession().then(() => {
      this.tmdbApiService
        .search({ query: value, page: 1 })
        .then((res) => {
          this.setState(
            {
              movies: res.results,
              page: 1,
              rated: { ratedMovie: [], ratedTotal: null, ratedPage: null, ratedIsEmpty: null },
              total: res.total_results,
              isLoading: false,
              hasError: false,
              isEmpty: !res.results.length,
              isOffline: false,
            },
            () => this.searchInputRef.current.focus(),
          );
        })
        .catch(() => this.setState({ isLoading: false, hasError: true, query: value }));

      this.tmdbApiService
        .getRatedMovie()
        .then((res) => {
          this.setState({
            isLoading: false,
            hasError: false,
            rated: {
              ratedPage: res.page,
              ratedMovie: res.results,
              total: res.total_results,
              isEmpty: !res.results.length,
            },
            isOffline: false,
          });
        })
        .catch(() => this.setState({ isLoading: false, hasError: true, query: value }));
    });
  }

  onChangePagination = (page) => {
    const { query } = this.state;

    this.setState({ page });

    this.tmdbApiService
      .search({ query: encodeURIComponent(query).trim(), page })
      .then((res) => {
        this.setState({
          page,
          movies: res.results,
          hasError: false,
          total: res.total_results,
          isEmpty: !res.results.length,
          isOffline: false,
        });
      })
      .catch(() => this.setState({ isLoading: false, hasError: true }));
  };

  onChangeSearchInput = ({ target: { value } }) => {
    const { query, page } = this.state;

    this.setState({
      query: value,
    });

    if (value.trim() === '') return null;
    if (query === value.trim()) return null;

    this.setState({
      isLoading: true,
    });

    this.debounceSendRequest({ value, page });
  };

  onChangeTab = (tab) => {
    const { query } = this.state;

    if (tab === 'rated') {
      this.setState({
        isLoading: true,
        total: null,
      });

      return this.tmdbApiService.getRatedMovie().then((res) => {
        this.setState({
          isLoading: false,
          hasError: false,
          rated: {
            ratedPage: res.page,
            ratedMovie: res.results,
            total: res.total_results,
            isEmpty: !res.results.length,
          },
          isOffline: false,
        });
      });
    }

    this.tmdbApiService
      .search({ query: encodeURIComponent(query).trim(), page: 1 })
      .then((res) => {
        this.setState(
          {
            movies: res.results,
            page: 1,
            total: res.total_results,
            isLoading: false,
            hasError: false,
            isEmpty: !res.results.length,
            isOffline: false,
          },
          () => this.searchInputRef.current.focus(),
        );
      })
      .catch(() => this.setState({ isLoading: false, hasError: true }));
  };

  sendRequest({ value, page }) {
    this.tmdbApiService
      .search({ query: encodeURIComponent(value).trim(), page })
      .then((res) => {
        this.setState({
          movies: res.results,
          isLoading: false,
          hasError: false,
          total: res.total_results,
          isEmpty: !res.results.length,
          isOffline: false,
        });
      })
      .catch(() => this.setState({ isLoading: false, hasError: true }));
  }

  render() {
    const {
      movies,
      query,
      total,
      page,
      isLoading,
      hasError,
      isEmpty,
      isOffline,
      rated: { ratedMovie, ratedTotal, ratedPage, ratedIsEmpty },
    } = this.state;

    let filteredMovie;

    if (movies && ratedMovie) {
      filteredMovie = [...movies].reduce((res, movie) => {
        ratedMovie.forEach((rated) => {
          if (rated.id === movie.id) {
            movie.rating = rated.rating;
          }
        });

        res.push(movie);
        return res;
      }, []);
    }

    const hasData = !(isLoading || hasError || isEmpty) && filteredMovie;
    const spinner = isLoading ? <Spinner /> : null;
    const error = hasError && !isOffline ? <ErrorMessage /> : null;
    const empty = isEmpty ? <EmptyMessage /> : null;
    const ratedEmpty = ratedIsEmpty ? <EmptyMessage /> : null;

    return (
      <TmdbApiServiceProvider value={this.tmdbApiService}>
        <Layout className="main">
          <Tabs onTabClick={this.onChangeTab} defaultActiveKey="1" centered size="large">
            <TabPane className="content-container" tab="Search" key="search">
              <Input
                ref={this.searchInputRef}
                placeholder="Type to search..."
                allowClear
                value={query}
                onChange={this.onChangeSearchInput}
              />
              {spinner}
              {hasData && <MovieList movies={filteredMovie} />}
              {error}
              {empty}
              {hasData && (
                <Pagination
                  showQuickJumper
                  size="small"
                  total={total}
                  showSizeChanger={false}
                  onChange={this.onChangePagination}
                  current={page}
                  pageSize={20}
                />
              )}
            </TabPane>

            <TabPane className="content-container" tab="Rated" key="rated">
              {!ratedMovie && <Spinner />}
              {ratedEmpty}

              {ratedMovie && <MovieList movies={ratedMovie} />}
              {hasData && (
                <Pagination
                  showQuickJumper
                  size="small"
                  total={ratedTotal}
                  showSizeChanger={false}
                  onChange={this.onChangePagination}
                  current={ratedPage}
                  pageSize={20}
                />
              )}
            </TabPane>
          </Tabs>

          {/* notify container */}
          <ToastContainer
            position="top-left"
            style={{ fontSize: '20px' }}
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Layout>
      </TmdbApiServiceProvider>
    );
  }
}

export default App;

function EmptyMessage() {
  return (
    <div
      style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Empty
        image={emptyLogo}
        imageStyle={{
          height: 120,
        }}
        description={
          <span style={{ fontSize: '20px' }}>Oops! We didn&apos;t find anything =(</span>
        }
      />
    </div>
  );
}

function ErrorMessage() {
  toast.error('Something wrong. Please try later..', {
    style: {
      fontSize: '17px',
      height: '100px',
    },
  });
}

function Spinner() {
  return (
    <div className="spinner-container">
      <Loader type="bubble-loop" bgColor="rgb(24, 144, 255)" size={100} />
    </div>
  );
}
