import React from 'react';
import { Layout, Menu, Table } from 'antd';
import { ReactComponent as Logo } from './images/secret.svg';
import { UserOutlined } from '@ant-design/icons';

const columns = [{
  title: 'Player Name',
  dataIndex: 'name',
  key: 'name',
  width: 300
}, {
  title: 'Aliases',
  dataIndex: 'alias',
  key: 'alias'
}];

const data = [];

const App = () => {
  return (
    <Layout style={{ height: '100vh' }}>
      <Layout.Sider trigger={null} collapsed>
        <div style={{ margin: '16px' }}>
          <Logo style={{ display: 'block', margin: 'auto', height: '32px', width: '32px' }} />
        </div>
        <Menu theme='dark' mode='inline' defaultSelectedKeys={['1']}>
          <Menu.Item key='1' icon={<UserOutlined />}>
            Players
          </Menu.Item>
        </Menu>
      </Layout.Sider>
      <Layout className='site-layout'>
        <Layout.Header className='site-layout-background' />
        <Layout.Content className='site-layout-background' style={{ margin: '10px' }}>
          <Table columns={columns} dataSource={data} />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default App;
