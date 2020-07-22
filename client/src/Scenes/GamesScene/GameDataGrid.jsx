import React from 'react';
import { useRecoilValueLoadable, useRecoilState } from 'recoil';
import { gamesQuery, selectedGameState } from '../../atoms';
import DataGrid from '../../components/DataGrid';

const columns = [{
  title: 'id',
  dataIndex: 'id',
  visible: false
}, {
  title: 'Title',
  dataIndex: 'title'
}, {
  title: 'Moderator',
  dataIndex: 'author',
  width: 250
}];

const GameDataGrid = () => {
  const [selectedGame, setSelectedGame] = useRecoilState(selectedGameState);
  const games = useRecoilValueLoadable(gamesQuery);
  const loading = games.state === 'loading';

  const onRowClicked = row => ({
    onClick: () => setSelectedGame(row.id)
  });

  return (
    <DataGrid
      onRow={onRowClicked}
      selectedRow={{ key: 'id', value: selectedGame }}
      loading={loading}
      columns={columns}
      dataSource={loading ? [] : games.contents}
      rowKey='id'
    />
  );
};

export default GameDataGrid;