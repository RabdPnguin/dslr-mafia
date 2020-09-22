import React from 'react';
import { useRecoilValueLoadable } from 'recoil';
import { playersQuery } from '../../atoms';
import DataGrid from '../../components/DataGrid';

const columns = [{
  title: 'Player',
  dataIndex: 'player',
  width: 200
}, {
  title: 'Votes',
  dataIndex: 'votes',
  width: 50
}, {
  title: 'Players Voting',
  dataIndex: 'playersVoting'
}, {
  title: 'Lynch',
  dataIndex: 'lynch',
  width: 50
}];

const PlayerDataGrid = () => {
  const players = useRecoilValueLoadable(playersQuery);
  const loading = players.state === 'loading';

  console.log(players);

  return (
    <DataGrid
      loading={loading}
      columns={columns}
      dataSource={loading ? [] : players.contents.map(player => ({ player }))}
      rowKey='player'
    />
  );
};

export default PlayerDataGrid;