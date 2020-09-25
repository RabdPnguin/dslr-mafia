import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Space, Tabs, Row, Col } from 'antd';
import React, { useRef } from 'react';
import { save } from 'save-file';
import DayPatterns from './DayPatterns';
import NightKillPatterns from './NightKillPatterns';
import NightPatterns from './NightPatterns';
import PlayerAliases from './PlayerAliases';
import PlayerListPatterns from './PlayerListPatterns';
import VotePatterns from './VotePatterns';
import useSetSettingsState from '../../hooks/useSetSettingsState';

const SettingsScene = () => {
  const setSettings = useSetSettingsState();
  const fileUploaderRef = useRef();

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