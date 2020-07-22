import React from 'react';
import { useRecoilValueLoadable } from 'recoil';
import { playersQuery } from '../../atoms';
import DataGrid from '../../components/DataGrid';

const columns = [{
  title: 'Player',
  dataIndex: 'player'
}];

const PlayerDataGrid = () => {
  const players = useRecoilValueLoadable(playersQuery);
  const loading = players.state === 'loading';

  return (
    <DataGrid
      loading={loading}
      columns={columns}
      dataSource={loading ? [] : players.contents.map(player => ({ player }))}
    />
  );
};

export default PlayerDataGrid;