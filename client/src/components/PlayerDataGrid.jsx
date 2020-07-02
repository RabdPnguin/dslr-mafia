import { Popconfirm } from 'antd';
import React from 'react';
import { useRecoilState } from 'recoil';
import { v4 as uuid } from 'uuid';
import { playersState } from '../atoms';
import AddPlayer from './AddPlayer';
import DataGrid from './DataGrid';

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
        <Popconfirm title={`Delete ${record.name}?`} onConfirm={() => playerDeleted(record.key)}>
          <a>Delete</a>
        </Popconfirm>
      ) : null
  }];

  return (
    <div {...props}>
      <AddPlayer onAdd={playerAdded} />
      <DataGrid
        columns={columns}
        dataSource={players}
        onChange={playerChanged}
      />
    </div>
  );
};

export default PlayerDataGrid;