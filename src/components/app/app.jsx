import 'react-toastify/dist/ReactToastify.css';
import './App.scss';

import React, { Component } from 'react';
import { Layout, Tabs } from 'antd';

import { NotifyContainer } from '../hoc-helper';
import { notifyMessage } from '../../utils';
import { ServicesProvider } from '../ServicesContext';
import { TmdbApiService, LocalStorageService } from '../../services';
import ErrorBoundary from '../ErrorBoundary';
import EmptyView from '../EmptyView';
import RatedPage from '../RatedPage';
import SearchPage from '../SearchPage';

const { TabPane } = Tabs;

class App extends Component {
  state = {};

  services = {
    tmdbApiService: new TmdbApiService(),
    localStorageService: new LocalStorageService(),
  };

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

  onChangeSearchPage = (newSearchPage) => {
    this.setState((prevState) => ({ searchPage: { ...prevState.searchPage, ...newSearchPage } }));
  };

  onChangeRatedPage = (newRatedPage) => {
    this.setState((prevState) => ({ ratedPage: { ...prevState.ratedPage, ...newRatedPage } }));
  };

  onChangeTab = (tab) => {
    const {
      searchPage: { query, page },
      ratedPage: { page: numRatedPage } = { page: 1 },
    } = this.state;

    switch (tab) {
      case 'search':
        return this.getSearchMovies({ query, page });
      case 'rated':
        return this.getRatedMovies({ page: numRatedPage });
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
      const res = await this.services.tmdbApiService.search({
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
      page,
    });

    this.setState({ hasError: false });

    try {
      const res = await this.services.tmdbApiService.getRatedMovie({ page });

      this.onChangeRatedPage({
        page: res.page,
        movies: res.results,
        total: res.total_results,
        isEmpty: !res.results.length,
      });
    } catch {
      this.setState({ hasError: true });
    } finally {
      this.onChangeRatedPage({ isLoading: false });
    }
  };

  filteredMovie = (searchMovies) => {
    const ratedMovies = this.services.localStorageService.loadLocalRated();

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

    const textError = 'Connection to server failed... Please try again';
    const textOffline = 'Please reconnect your internet';

    const hasErrors = isOffline && hasError;

    return (
      <ServicesProvider value={this.services}>
        <Layout className="main">
          <Tabs onTabClick={this.onChangeTab} defaultActiveKey="search" centered size="large">
            <TabPane className="content-container" tab="Search" key="search">
              {!hasErrors && (
                <ErrorBoundary>
                  <SearchPage
                    onChangeSearchPage={this.onChangeSearchPage}
                    getSearchMovies={this.getSearchMovies}
                    searchPage={searchPage}
                  />
                </ErrorBoundary>
              )}
            </TabPane>

            <TabPane className="content-container" tab="Rated" key="rated">
              {!hasErrors && (
                <ErrorBoundary>
                  <RatedPage
                    onChangeRatedPage={this.onChangeRatedPage}
                    getRatedMovies={this.getRatedMovies}
                    ratedPage={ratedPage}
                  />
                </ErrorBoundary>
              )}
            </TabPane>
          </Tabs>

          {hasError && <EmptyView label={textError} />}
          {hasError && notifyMessage('error', textError)}

          {isOffline && <EmptyView label={textOffline} />}

          <NotifyContainer />
        </Layout>
      </ServicesProvider>
    );
  }
}

export default App;
