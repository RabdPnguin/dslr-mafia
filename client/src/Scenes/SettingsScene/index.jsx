import React, {useRef} from 'react';
import PlayerAliases from './PlayerAliases';
import PlayerListPatterns from './PlayerListPatterns';
import {Tabs, Space, Button} from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { save } from 'save-file';

const SettingsScene = () => {
  const fileUploaderRef = useRef();

  const importSettings = event => {
    // event.stopPropagation();
    // event.preventDefault();

    // const file = event.target.files[0];
    // const reader = new FileReader();
    // reader.readAsText(file);
    // reader.onload = e => {
    //   setAliases(JSON.parse(e.target.result));
    // }
  };

  const exportSettings = async () => {
    // await save(JSON.stringify(aliases), 'settings.json');
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
      <Tabs>
        <Tabs.TabPane key='tab-alias' tab='Player Aliases'>
          <PlayerAliases />
        </Tabs.TabPane>
        <Tabs.TabPane key='tab-playerListPattern' tab='Player List Patterns'>
          <PlayerListPatterns />
        </Tabs.TabPane>
      </Tabs>
    </>
  );
};

export default SettingsScene;