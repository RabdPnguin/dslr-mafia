import React from 'react';
import { useRecoilValueLoadable } from 'recoil';
import { playersQuery } from '../../atoms';
import DataGrid from '../../components/DataGrid';

const columns = [{
  title: 'Player',
  dataIndex: 'player',
  key: 'player'
}];

const PlayerDataGrid = props => {
  const players = useRecoilValueLoadable(playersQuery);
  const loading = players.state === 'loading';

  return (
    <div {...props}>
      <DataGrid
        loading={false}
        bordered={false}
        size='small'
        rowKey='title'
        columns={columns}
        dataSource={loading ? [] : players.contents.map(player => ({ player }))}
      />
    </div>
  );
};

export default PlayerDataGrid;