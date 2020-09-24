import { Popconfirm, Button, Space } from 'antd';
import React, { useRef } from 'react';
import { useRecoilState } from 'recoil';
import { v4 as uuid } from 'uuid';
import { aliasState } from '../../atoms';
import AddPlayer from './AddPlayer';
import DataGrid from '../../components/DataGrid';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { save } from 'save-file';

const PlayerDataGrid = props => {
  const [players, setPlayers] = useRecoilState(aliasState);
  const fileUploaderRef = useRef();

  const playerDeleted = key => {
    setPlayers(players.filter(player => player.key !== key));
  };

  const playerChanged = player => {
    setPlayers(players.map(p => p.key !== player.key ? p : { ...p, ...player }));
  };

  const playerAdded = player => {
    const newPlayer = {
      key: uuid(),
      ...player
    };

    setPlayers([...players, newPlayer]);
  };

  const importPlayers = event => {
    event.stopPropagation();
    event.preventDefault();

    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = e => {
      setPlayers(JSON.parse(e.target.result));
    }
  };

  const exportPlayers = async () => {
    await save(JSON.stringify(players), 'players.json');
  };

  const columns = [{
    title: 'Player Name',
    dataIndex: 'name',
    editable: true,
    width: 250
  }, {
    title: 'Aliases',
    dataIndex: 'aliases',
    editable: true
  }, {
    key: 'x',
    align: 'right',
    render: (text, record) =>
      players.length >= 1 ? (
        <Popconfirm title={`Delete ${record.name}?`} onConfirm={() => playerDeleted(record.key)}>
          <a>Delete</a>
        </Popconfirm>
      ) : null
  }];

  return (
    <div {...props}>
      <input type="file" id="playersFile" ref={fileUploaderRef} onChange={importPlayers} style={{ display: "none" }} />
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
          onClick={exportPlayers}>
          Export
        </Button>
      </Space>
      <AddPlayer style={{ marginBottom: 16 }} onAdd={playerAdded} />
      <DataGrid
        columns={columns}
        dataSource={players}
        onChange={playerChanged}
      />
    </div>
  );
};

export default PlayerDataGrid;