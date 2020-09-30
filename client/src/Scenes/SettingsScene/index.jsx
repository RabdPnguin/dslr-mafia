import { DownloadOutlined, GithubOutlined, UploadOutlined, SmileOutlined } from '@ant-design/icons';
import { Button, Space, Tabs, notification } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import { save } from 'save-file';
import useSettingsState from '../../hooks/useSettingsState';
import DayKillPatterns from './DayKillPatterns';
import DayPatterns from './DayPatterns';
import NightKillPatterns from './NightKillPatterns';
import NightPatterns from './NightPatterns';
import PlayerAliases from './PlayerAliases';
import PlayerListPatterns from './PlayerListPatterns';
import VotePatterns from './VotePatterns';

const SettingsScene = () => {
  const [,setSettings] = useSettingsState();
  const fileUploaderRef = useRef();
  
  const [imported, setImported] = useState(false);
  useEffect(() => {
    if (imported) {
      setImported(false);
      notification.open({
        message: 'Settings imported successfully!',
        icon: <SmileOutlined />
      });
    }
  }, [imported]);

  const loadDefaults = () => {
    fetch('https://gist.githubusercontent.com/RabdPnguin/fe9ade0e7498bd3eb144248f4af7d3cc/raw/26c0d54ebbb06baa6ed2c94d6400c4cf314501c8/settings.json')
      .then(response => response.json())
      .then(json => {
        setSettings(json);
        setImported(true);
      });
  };

  const importSettings = event => {
    event.stopPropagation();
    event.preventDefault();

    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = e => {
      const settings = JSON.parse(e.target.result);
      setSettings(settings);
    }
  };

  const exportSettings = async () => {
    const settings = localStorage.getItem('recoil-persist') ?? {};
    await save(settings, 'settings.json');
  };

  return (
    <>
      <input type="file" id="playersFile" ref={fileUploaderRef} onChange={importSettings} style={{ display: "none" }} />
      <Space style={{ marginBottom: 16 }}>
        <Button
          style={{ width: '100px' }}
          type='primary'
          icon={<UploadOutlined />}
          onClick={() => fileUploaderRef.current.click()}>
          Import
        </Button>
        <Button
          style={{ width: '100px' }}
          type='primary'
          icon={<DownloadOutlined />}
          onClick={exportSettings}>
          Export
        </Button>
        <Button
          style={{width: '150px'}}
          type='secondary'
          icon={<GithubOutlined />}
          onClick={loadDefaults}>
          Load Defaults
        </Button>
      </Space>
      <Tabs tabPosition='left'>
        <Tabs.TabPane key='tab-alias' tab='Player Aliases'>
          <PlayerAliases />
        </Tabs.TabPane>
        <Tabs.TabPane key='tab-playerListPattern' tab='Player List Patterns'>
          <PlayerListPatterns />
        </Tabs.TabPane>
        <Tabs.TabPane key='tab-vote' tab='Vote Patterns'>
          <VotePatterns />
        </Tabs.TabPane>
        <Tabs.TabPane key='tab-day' tab='Day Transition Patterns'>
          <DayPatterns />
        </Tabs.TabPane>
        <Tabs.TabPane key='tab-daykill' tab='Day Kill Patterns'>
          <DayKillPatterns />
        </Tabs.TabPane>
        <Tabs.TabPane key='tab-night' tab='Night Transition Patterns'>
          <NightPatterns />
        </Tabs.TabPane>
        <Tabs.TabPane key='tab-nightkill' tab='Night Kill Patterns'>
          <NightKillPatterns />
        </Tabs.TabPane>
      </Tabs>
    </>
  );
};

export default SettingsScene;