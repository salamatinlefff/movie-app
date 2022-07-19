import 'react-toastify/dist/ReactToastify.css';
import './App.scss';

import React, { Component } from 'react';
import { Layout, Tabs } from 'antd';

import { TmdbApiService } from '../../services/TmdbApiService';
import { TmdbApiServiceProvider } from '../../tmdbApiContext';
import { NotifyContainer } from '../hoc-helper';
import { notifyMessage } from '../../utils';
import { loadLocalRated } from '../../services';
import ErrorBoundary from '../ErrorBoundary';
import EmptyIndicator from '../EmptyIndicator';
import RatedPage from '../RatedPage';
import SearchPage from '../SearchPage';

const { TabPane } = Tabs;

class App extends Component {
  state = {};

  tmdbApiService = new TmdbApiService();

  componentDidMount() {
    this.setState({
      isOffline: false,
      hasError: false,
    });

    window.addEventListener('offline', () => {
      notifyMessage('error', 'Connection lost!');

      this.setState({
        isOffline: true,
        hasError: false,
      });
    });

    window.addEventListener('online', () => {
      notifyMessage('success', 'Connection restored!');

      this.setState({
        isOffline: false,
        hasError: false,
      });
    });
  }

  onChangeSearchPage = (searchPage) => {
    this.setState((prevState) => ({ searchPage: { ...prevState.searchPage, ...searchPage } }));
  };

  onChangeRatedPage = (ratedPage) => {
    this.setState((prevState) => ({ ratedPage: { ...prevState.ratedPage, ...ratedPage } }));
  };

  onChangeTab = (tab) => {
    const {
      searchPage: { query, page },
    } = this.state;

    switch (tab) {
      case 'search':
        return this.getSearchMovies({ query, page });
      case 'rated':
        return this.getRatedMovies({ page: 1 });
      default:
        return null;
    }
  };

  getSearchMovies = async ({ query, page }) => {
    this.onChangeSearchPage({
      isLoading: true,
    });
    this.setState({ hasError: false });

    try {
      const res = await this.tmdbApiService.search({
        query: encodeURIComponent(query).trim(),
        page,
      });

      this.onChangeSearchPage({
        page,
        movies: this.filteredMovie(res.results),
        total: res.total_results,
        isEmpty: !res.results.length,
      });
    } catch {
      this.setState({ hasError: true });
    } finally {
      this.onChangeSearchPage({ isLoading: false });
    }
  };

  getRatedMovies = async ({ page }) => {
    this.onChangeRatedPage({
      isLoading: true,
    });

    this.setState({ hasError: false });

    try {
      const res = await this.tmdbApiService.getRatedMovie({ page });

      this.onChangeRatedPage({
        page: res.page,
        movies: res.results,
        total: res.total_results,
        isEmpty: !res.results.length,
      });
    } catch {
      this.setState({ hasError: true });
    } finally {
      this.onChangeSearchPage({ isLoading: false });
    }
  };

  filteredMovie = (searchMovies) => {
    const ratedMovies = loadLocalRated();

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

  render() {
    const { isOffline, hasError, searchPage, ratedPage } = this.state;

    return (
      <TmdbApiServiceProvider value={this.tmdbApiService}>
        <Layout className="main">
          <Tabs onTabClick={this.onChangeTab} defaultActiveKey="search" centered size="large">
            <TabPane className="content-container" tab="Search" key="search">
              {!isOffline && (
                <ErrorBoundary>
                  <SearchPage
                    onChangeSearchPage={this.onChangeSearchPage}
                    searchPage={searchPage}
                    sendRequest={this.getSearchMovies}
                  />
                </ErrorBoundary>
              )}
            </TabPane>

            <TabPane className="content-container" tab="Rated" key="rated">
              <ErrorBoundary>
                <RatedPage getMovie={this.getRatedMovies} ratedPage={ratedPage} />
              </ErrorBoundary>
            </TabPane>
          </Tabs>

          {hasError && <EmptyIndicator label="Connection to server failed... Please try again" />}
          {hasError && notifyMessage('error', 'Connection to server failed... Please try again')}
          {isOffline && <EmptyIndicator label="Please reconnect your internet" />}

          <NotifyContainer />
        </Layout>
      </TmdbApiServiceProvider>
    );
  }
}

export default App;
