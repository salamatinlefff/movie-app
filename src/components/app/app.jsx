import { Empty, Input, Layout, Pagination, Tabs } from 'antd';
import Loader from 'react-js-loader';
import React, { Component, createRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import MoviesList from '../MoviesList';
import { debounce, search } from '../services/services';

import emptyLogo from './empty.svg';

import 'react-toastify/dist/ReactToastify.css';
import './App.scss';

const { TabPane } = Tabs;

class App extends Component {
  state = { isLoading: true };

  searchInputRef = createRef();

  debounceSendRequest = debounce(this.sendRequest, 400);

  componentDidMount() {
    const value = 'return';

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

    search({ query: encodeURIComponent(value).trim(), page: 1 })
      .then((res) => {
        this.setState(
          {
            query: value,
            movies: res.results,
            page: 1,
            total: res.total_results,
            isLoading: false,
            isError: false,
            isEmpty: !res.results.length,
            isOffline: false,
          },
          () => this.searchInputRef.current.focus(),
        );
      })
      .catch(() => this.setState({ isLoading: false, isError: true, query: value }));
  }

  onChangePagination = (page) => {
    const { query } = this.state;

    this.setState({ page });

    search({ query: encodeURIComponent(query).trim(), page })
      .then((res) => {
        this.setState({
          page,
          movies: res.results,
          isError: false,
          total: res.total_results,
          isEmpty: !res.results.length,
          isOffline: false,
        });
      })
      .catch(() => this.setState({ isLoading: false, isError: true }));
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

  sendRequest({ value, page }) {
    search({ query: encodeURIComponent(value).trim(), page })
      .then((res) => {
        this.setState({
          movies: res.results,
          isLoading: false,
          isError: false,
          total: res.total_results,
          isEmpty: !res.results.length,
          isOffline: false,
        });
      })
      .catch(() => this.setState({ isLoading: false, isError: true }));
  }

  render() {
    const { movies, query, total, page, isLoading, isError, isEmpty, isOffline } = this.state;

    console.log('movies :', movies);

    const hasData = !(isLoading || isError || isEmpty);
    const movieList = hasData ? <MoviesList movies={movies} /> : null;
    const spinner = isLoading ? <Spinner /> : null;
    const error = isError && !isOffline ? <ErrorMessage /> : null;
    const empty = isEmpty ? <EmptyMessage /> : null;

    return (
      <Layout className="main">
        <Tabs defaultActiveKey="1" centered size="large">
          <TabPane className="content-container" tab="Search" key="1">
            <Input
              ref={this.searchInputRef}
              placeholder="Type to search..."
              allowClear
              value={query}
              onChange={this.onChangeSearchInput}
            />
            {spinner}
            {movieList}
            {error}
            {empty}
          </TabPane>

          <TabPane className="content-container" tab="Rated" key="2" />
        </Tabs>

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
