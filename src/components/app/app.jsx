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
  state = { needUpdateSearch: false, needUpdateRated: false };

  services = {
    tmdbApiService: new TmdbApiService(),
    localStorageService: new LocalStorageService(),
  };

  componentDidMount() {
    this.setState({
      isOffline: false,
    });

    window.addEventListener('offline', this.callbackOffline);
    window.addEventListener('online', this.callbackOnline);
  }

  componentWillUnmount() {
    window.removeEventListener('offline', this.callbackOffline);
    window.removeEventListener('online', this.callbackOnline);
  }

  callbackOffline = () => {
    notifyMessage('error', 'Connection lost!');

    this.setState({
      isOffline: true,
    });
  };

  callbackOnline = () => {
    notifyMessage('success', 'Connection restored!');

    this.setState({
      isOffline: false,
    });
  };

  onChangeTab = (tab) => {
    this.setState({});
    switch (tab) {
      case 'search':
        return this.setState({ needUpdateSearch: true });
      case 'rated':
        return this.setState({ needUpdateRated: true });
      default:
        return null;
    }
  };

  onCancelUpdatePages = () => this.setState({ needUpdateSearch: false, needUpdateRated: false });

  render() {
    const { isOffline } = this.state;

    const textOffline = 'Please reconnect your internet';

    return (
      <ServicesProvider value={this.services}>
        <Layout className="main">
          <Tabs onTabClick={this.onChangeTab} defaultActiveKey="search" centered size="large">
            <TabPane forceRender className="content-container" tab="Search" key="search">
              {!isOffline && (
                <ErrorBoundary>
                  <SearchPage
                    onCancelUpdatePages={this.onCancelUpdatePages}
                    needUpdateSearch={this.state.needUpdateSearch}
                    services={this.services}
                  />
                </ErrorBoundary>
              )}
            </TabPane>

            <TabPane className="content-container" tab="Rated" key="rated">
              {!isOffline && (
                <ErrorBoundary>
                  <RatedPage
                    onCancelUpdatePages={this.onCancelUpdatePages}
                    needUpdateRated={this.state.needUpdateRated}
                    services={this.services}
                  />
                </ErrorBoundary>
              )}
            </TabPane>
          </Tabs>

          {isOffline && <EmptyView label={textOffline} />}

          <NotifyContainer />
        </Layout>
      </ServicesProvider>
    );
  }
}

export default App;
