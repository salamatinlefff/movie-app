import { Input, Layout, Pagination, Tabs } from 'antd';
import React, { Component, createRef } from 'react';

import MoviesList from '../MoviesList';
import { debounce, search } from '../services/services';

import './App.scss';

const { TabPane } = Tabs;

class App extends Component {
  state = {};

  searchInputRef = createRef();

  componentDidMount() {
    const value = 'return';

    search({ query: encodeURIComponent(value).trim(), page: 1 }).then((res) => {
      console.log('res :', res);
      this.setState({
        query: value,
        movies: res.results,
        page: 1,
        total: res.total_results,
      });
    });
  }

  componentDidUpdate() {
    this.searchInputRef.current.focus();
  }

  onChangePagination = (page) => {
    console.log('page :', page);
    const { query } = this.state;

    this.setState({ page });

    search({ query: encodeURIComponent(query).trim(), page }).then((res) => {
      this.setState({
        page,
        movies: res.results,
      });
    });
  };

  onChangeSearchInput = ({ target: { value } }) => {
    const { query, page } = this.state;

    this.setState({
      query: value,
    });

    if (value.trim() === '') return null;
    if (query === value.trim()) return null;

    return debounce(
      search({ query: encodeURIComponent(value).trim(), page }).then((res) => {
        this.setState({
          movies: res.results,
        });
      }),
      400,
    );
  };

  render() {
    const { movies, query, total, page } = this.state;
    console.log('movies :', movies);

    if (!movies) return null;

    const showTotal = (total1) => `Total ${total1} items`;
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
            <MoviesList
              movies={movies}
              url="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
            />
          </TabPane>

          <TabPane className="content-container" tab="Rated" key="2">
            <Input
              placeholder="Type to search among rated..."
              allowClear
              onChange={debounce(this.onChangeSearchInput, 400)}
            />
            <MoviesList
              movies={movies}
              url="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZ2fSqwjlzwi465PLW856Urwisp0ua7axWHQ&usqp=CAU"
            />
          </TabPane>
        </Tabs>

        <Pagination
          showSizeChanger
          showQuickJumper
          size="small"
          total={total}
          defaultPageSize={20}
          pageSizeOptions={[20]}
          showTotal={showTotal}
          onChange={this.onChangePagination}
          current={page}
          pageSize={5}
        />
      </Layout>
    );
  }
}

export default App;
