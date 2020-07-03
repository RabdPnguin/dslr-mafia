import { Popconfirm, Button, Space } from 'antd';
import React from 'react';
import { useRecoilState } from 'recoil';
import { v4 as uuid } from 'uuid';
import { playersState } from '../atoms';
import AddPlayer from './AddPlayer';
import DataGrid from './DataGrid';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';

const PlayerDataGrid = props => {
  const [players, setPlayers] = useRecoilState(playersState);

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
  }

  let columns = [{
    title: 'Player Name',
    dataIndex: 'name',
    key: 'name',
    editable: true,
    width: 250
  }, {
    title: 'Aliases',
    dataIndex: 'aliases',
    key: 'aliases',
    editable: true
  }, {
    title: '',
    dataIndex: '',
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
      <Space style={{ marginBottom: 16 }}>
        <Button style={{ width: '100px' }} type='primary' icon={<UploadOutlined />}>Import</Button>
        <Button style={{ width: '100px' }} type='primary' icon={<DownloadOutlined />}>Export</Button>
      </Space>
      <AddPlayer style={{ marginBottom: 16 }} onAdd={playerAdded} />
      <DataGrid
        columns={columns}
        bordered={false}
        dataSource={players}
        onChange={playerChanged}
      />
    </div>
  );
};

export default PlayerDataGrid;