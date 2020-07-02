import { Popconfirm } from 'antd';
import React from 'react';
import { useRecoilState } from 'recoil';
import { playersState } from '../atoms';
import DataGrid from './DataGrid';

const PlayerDataGrid = props => {
  const [players, setPlayers] = useRecoilState(playersState);

  const recordDeleted = id => {
    setPlayers(players.filter(player => player.id !== id));
  };

  const recordChanged = record => {
    setPlayers(players.map(player => player.id !== record.id
      ? player
      : { ...player, ...record }));
  };

  let columns = [{
    title: 'Player Name',
    dataIndex: 'name',
    key: 'name',
    editable: true,
    width: 300
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
        <Popconfirm title={`Delete ${record.name}?`} onConfirm={() => recordDeleted(record.id)}>
          <a>Delete</a>
        </Popconfirm>
      ) : null
  }];

  return (
    <DataGrid
      columns={columns}
      dataSource={players}
      onChange={recordChanged}
      {...props} />
  );
};

export default PlayerDataGrid;