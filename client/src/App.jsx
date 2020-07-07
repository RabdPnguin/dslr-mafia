import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { ReactComponent as Logo } from './images/secret.svg';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import PlayersScene from './Scenes/PlayersScene';
import GamesScene from './Scenes/GamesScene';

const menuItems = {
  '1': {
    label: 'Players',
    icon: <UserOutlined />,
    scene: <PlayersScene style={{ width: '50%', minWidth: '550px' }} />
  },
  '2': {
    label: 'Games',
    icon: <TeamOutlined />,
    scene: (
      <React.Suspense fallback={<div />}>
        <GamesScene />
      </React.Suspense>
    )
  }
}

const App = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState('1');

  const selectedMenuItemChanged = ({ key }) => setSelectedMenuItem(key);

  return (
    <Layout style={{ height: '100vh' }}>
      <Layout.Sider trigger={null} collapsed>
        <div style={{ margin: '16px' }}>
          <Logo style={{ display: 'block', margin: 'auto', height: '32px', width: '32px' }} />
        </div>
        <Menu theme='dark' mode='inline' selectedKeys={[selectedMenuItem]} onSelect={selectedMenuItemChanged}>
          {
            Object.entries(menuItems)
              .map(([key, value]) => (
                <Menu.Item key={key} icon={value.icon}>
                  {value.label}
                </Menu.Item>
              ))
          }
        </Menu>
      </Layout.Sider>
      <Layout className='site-layout'>
        <Layout.Header className='site-layout-background' />
        <Layout.Content className='site-layout-background' style={{ margin: '20px' }}>
          {menuItems[selectedMenuItem].scene}
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default App;
