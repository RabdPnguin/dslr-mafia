import { Button, Empty, Skeleton, Tabs } from 'antd';
import React, { useLayoutEffect, useEffect, useState } from 'react';
import useClipboard from 'react-use-clipboard';
import { useRecoilValue } from 'recoil';
import { selectedGameState } from '../../atoms';
import DataGrid from '../../components/DataGrid';
import useGameVotes from '../../hooks/useGameVotes';
import './Votes.less';

const Votes = () => {
  const selectedGame = useRecoilValue(selectedGameState);
  const [gameVotes, loading] = useGameVotes();
  const [selectedTab, setSelectedTab] = useState('tab-day1');
  const [formattedVotes, setFormattedVotes] = useState('');

  useEffect(() => {
    setSelectedTab('tab-day1');
  }, [selectedGame]);

  useLayoutEffect(() => {
    if (gameVotes?.length) {
      const day = +selectedTab.replace('tab-day', '') - 1;
      setFormattedVotes(gameVotes[day].players
        .filter(p => p.formattedString)
        .map(p => p.formattedString)
        .join('\r\n'));
    }
  }, [gameVotes, selectedTab]);

  const [isCopied, setCopied] = useClipboard(formattedVotes, {
    successDuration: 3000
  });

  if (!selectedGame) {
    return null;
  }

  if (loading) {
    return <Skeleton active />;
  }

  if (!gameVotes.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No game data found.' />;
  }

  const columns = [{
    title: 'Player',
    dataIndex: 'name',
    width: 200
  }, {
    title: 'Vote',
    dataIndex: 'vote',
    width: 200
  }, {
    title: <Button type='primary' onClick={setCopied}>{isCopied ? 'Votes copied!' : 'Copy to clipboard'}</Button>,
    dataIndex: 'formatted'
  }];

  return (
    <>
      <Tabs tabPosition='left' onChange={setSelectedTab} activeKey={selectedTab}>
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