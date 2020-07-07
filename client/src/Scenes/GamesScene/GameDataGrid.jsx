import React from 'react';
import { useRecoilValue } from 'recoil';
import { gamesQuery } from '../../atoms';
import DataGrid from '../../components/DataGrid';

const GameDataGrid = props => {
  const games = useRecoilValue(gamesQuery);

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
        bordered={false}
        size='small'
        rowKey='title'
        columns={columns}
        dataSource={games}
      />
    </div>
  );
};

export default GameDataGrid;