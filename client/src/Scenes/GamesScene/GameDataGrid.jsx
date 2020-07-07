import React from 'react';
import { useRecoilValueLoadable } from 'recoil';
import { gamesQuery } from '../../atoms';
import DataGrid from '../../components/DataGrid';

const GameDataGrid = props => {
  const games = useRecoilValueLoadable(gamesQuery);
  const loading = games.state === 'loading';

  console.log(games);

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

  return (
    <div {...props}>
      <DataGrid
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