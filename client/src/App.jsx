import { SettingOutlined, TeamOutlined, FrownOutlined } from '@ant-design/icons';
import { Layout, Menu, notification } from 'antd';
import React, { useState, useEffect } from 'react';
import { ReactComponent as Logo } from './images/secret.svg';
import GamesScene from './Scenes/GamesScene';
import SettingsScene from './Scenes/SettingsScene';
import useSettingsState from './hooks/useSettingsState';

const menuItems = {
  '1': {
    label: 'Settings',
    icon: <SettingOutlined />,
    scene: <SettingsScene />
  },
  '2': {
    label: 'Games',
    icon: <TeamOutlined />,
    scene: <GamesScene />
  }
}

const App = () => {
  const [settings] = useSettingsState();
  const [selectedMenuItem, setSelectedMenuItem] = useState('2');

  useEffect(() => {
    const missingSettings = Object.entries(settings)
      .filter(([k]) => !k.endsWith('Display'))
      .filter(([k]) => k !== 'playerAliases' && !settings[k].length);

    if (missingSettings.length && selectedMenuItem !== '1') {
      setSelectedMenuItem('1');
      const missingSetting = settings[`${missingSettings[0][0]}Display`];
      notification.open({
        message: <span>Missing settings. Please fill in settings for <b>{missingSetting}</b> or Load Defaults.</span>,
        icon: <FrownOutlined style={{color: 'red'}} />
      });
    }
  }, [settings, selectedMenuItem]);

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
        <Layout.Content className='site-layout-background' style={{ margin: '15px' }}>
          {menuItems[selectedMenuItem].scene}
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default App;
