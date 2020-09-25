import { Popconfirm } from 'antd';
import React from 'react';
import { useRecoilState } from 'recoil';
import { v4 as uuid } from 'uuid';
import { playerAliasState } from '../../atoms';
import DataGrid from '../../components/DataGrid';
import AddPlayer from './AddPlayer';

const PlayerAliases = () => {
  const [aliases, setAliases] = useRecoilState(playerAliasState);

  const addPlayer = player => {
    const newPlayer = {key: uuid(), ...player};
    setAliases([...aliases, newPlayer]);
  };

  const updatePlayer = player => {
    setAliases(
      aliases.map(a => a.key === player.key ? { ...a, ...player } : a)
    );
  };

  const deletePlayer = key => {
    setAliases(aliases.filter(player => player.key !== key));
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
      aliases.length >= 1 ? (
        <Popconfirm title={`Delete ${record.name}?`} onConfirm={() => deletePlayer(record.key)}>
          <a>Delete</a>
        </Popconfirm>
      ) : null
  }];

  return (
    <div style={{ width: '50%', minWidth: '550px' }}>
      <AddPlayer style={{ marginBottom: 16 }} onAdd={addPlayer} />
      <DataGrid
        columns={columns}
        dataSource={aliases}
        onChange={updatePlayer}
      />
    </div>
  );
};

export default PlayerAliases;