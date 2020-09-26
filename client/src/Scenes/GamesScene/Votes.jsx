import { Empty, Skeleton, Tabs } from 'antd';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { selectedGameState } from '../../atoms';
import DataGrid from '../../components/DataGrid';
import useGameVotes from '../../hooks/useGameVotes';
import './Votes.less';

const columns = [{
  title: 'Player',
  dataIndex: 'name',
  width: 200
}, {
  title: 'Vote',
  dataIndex: 'vote',
  width: 200
}, {
  title: 'Formatted',
  dataIndex: 'formatted'
}];

const Votes = () => {
  const selectedGame = useRecoilValue(selectedGameState);
  const [gameVotes, loading] = useGameVotes();

  console.log(gameVotes);

  if (!selectedGame) {
    return null;
  }

  if (loading) {
    return <Skeleton active />;
  }

  if (!gameVotes.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No game data found.' />;
  }

  return (
    <>
      <Tabs tabPosition='left'>
        {gameVotes.map(({day, players}) => (
          <Tabs.TabPane key={`tab-day${day}`} tab={`Day ${day}`}>
             <DataGrid
               rowClassName={record => record.isDead ? 'dead-player' : ''}
               loading={loading}
               columns={columns}
               dataSource={players}
               rowKey='name' />
          </Tabs.TabPane>))
        }
      </Tabs>
    </>
  );
};

export default Votes;