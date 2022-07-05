import { Input, Layout, Pagination, Tabs } from 'antd';
import React from 'react';

import MoviesList from '../movies-list';

import './app.scss';

const { TabPane } = Tabs;

function App() {
  const onChange = (e) => {
    console.log(e);
  };

  return (
    <Layout className="main">
      <Tabs defaultActiveKey="1" centered size="large">
        <TabPane className="container" tab="Search" key="1">
          <Input placeholder="Type to search..." allowClear onChange={onChange} />
          <MoviesList url="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp" />
        </TabPane>

        <TabPane className="container" tab="Rated" key="2">
          <Input placeholder="Type to search among rated..." allowClear onChange={onChange} />
          <MoviesList url="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZ2fSqwjlzwi465PLW856Urwisp0ua7axWHQ&usqp=CAU" />
        </TabPane>
      </Tabs>

      <Pagination showQuickJumper size="small" total={500} current={1} />
    </Layout>
  );
}

export default App;
