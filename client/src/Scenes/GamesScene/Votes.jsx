import { Button, Empty, Skeleton, Tabs } from 'antd';
import React, { useLayoutEffect, useEffect, useState, useRef } from 'react';
import useClipboard from 'react-use-clipboard';
import { useRecoilValue } from 'recoil';
import { selectedGameState } from '../../atoms';
import DataGrid from '../../components/DataGrid';
import useGameVotes from '../../hooks/useGameVotes';
import './Votes.less';
import produce from 'immer';

const Votes = () => {
  const selectedGame = useRecoilValue(selectedGameState);
  const [gameVotes, loading] = useGameVotes();
  const [selectedTab, setSelectedTab] = useState('tab-day1');
  const [formattedVotes, setFormattedVotes] = useState('');
  const [displayVotes, setDisplayVotes] = useState([]);

  useEffect(() => {
    setSelectedTab('tab-day1');
  }, [selectedGame]);

  useEffect(() => {
    setDisplayVotes([]);
    setFormattedVotes([]);

    if (gameVotes?.length) {
      const day = +selectedTab.replace('tab-day', '') - 1;
      let newFormattedVotes = [];
      let notVoting = [];
      let newDisplayVotes = produce(gameVotes, draft => {
        for (let i = 0; i < gameVotes[day].players.length; ++i) {
          const player = gameVotes[day].players[i];
          if (player.isDead) continue;

          if (player.votesFrom.length) {
            const numActivePlayers = gameVotes[day].players.filter(p => !p.isDead).length;
            const votesToLynch = Math.ceil(numActivePlayers / 2);
            draft[day].players[i].formatted = <span><b>{player.name}</b> -{player.votesFrom.length}- <i>{player.votesFrom.join(', ')}</i> {`(L-${votesToLynch - player.votesFrom.length})`}</span>;
            newFormattedVotes.push(`<b>${player.name}</b> -${player.votesFrom.length}- <i>${player.votesFrom.join(', ')}</i> (L-${votesToLynch - player.votesFrom.length})`)
          }
          
          if (!player.vote) {
            notVoting.push(player.name);
          }
        }
      })

      if (notVoting.length) {
        newFormattedVotes.push(`\r\n<b>Players not voting</b>: <i>${notVoting.join(', ')}</i>`);
    }

      setDisplayVotes(newDisplayVotes);
      setFormattedVotes(newFormattedVotes.join('\r\n'));
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

  if (!displayVotes.length) {
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
        {displayVotes.map(({day, players}) => (
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