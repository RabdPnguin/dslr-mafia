import React from 'react';
import { useRecoilValue } from 'recoil';
import { gamesQuery } from '../../atoms';
import DataGrid from '../../components/DataGrid';

const GamesScene = () => {
  const games = useRecoilValue(gamesQuery);

  const columns = [{
    title: 'Title',
    dataIndex: 'title',
    key: 'title'
  }, {
    title: 'Moderator',
    dataIndex: 'author',
    key: 'author'
  }];

  return (
    <DataGrid
      bordered={false}
      size='small'
      rowKey='title'
      columns={columns}
      dataSource={games}
    />
  );
};

export default GamesScene;