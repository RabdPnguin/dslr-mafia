import React from 'react';
import { useRecoilValueLoadable, useRecoilState } from 'recoil';
import { gamesQuery, selectedGameState } from '../../atoms';
import DataGrid from '../../components/DataGrid';

const columns = [{
  title: 'Title',
  dataIndex: 'title',
  key: 'title'
}, {
  title: 'Moderator',
  dataIndex: 'author',
  key: 'author',
  width: 250
}];

const GameDataGrid = props => {
  const [selectedGame, setSelectedGame] = useRecoilState(selectedGameState);
  const games = useRecoilValueLoadable(gamesQuery);
  const loading = games.state === 'loading';

  const onRowClicked = row => ({
    onClick: () => setSelectedGame(row.title)
  });

  return (
    <div {...props}>
      <DataGrid
        onRow={onRowClicked}
        selectedRow={{ key: 'title', value: selectedGame }}
        loading={loading}
        bordered={false}
        size='small'
        rowKey='title'
        columns={columns}
        dataSource={loading ? [] : games.contents}
      />
    </div>
  );
};

export default GameDataGrid;