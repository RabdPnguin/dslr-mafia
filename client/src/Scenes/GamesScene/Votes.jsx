import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Empty, Skeleton, Tabs, Row, Menu } from 'antd';
import produce from 'immer';
import React, { useEffect, useState, useLayoutEffect } from 'react';
import useClipboard from 'react-use-clipboard';
import { useRecoilValue } from 'recoil';
import { selectedGameState } from '../../atoms';
import DataGrid from '../../components/DataGrid';
import useGameVotes from '../../hooks/useGameVotes';
import { playerAliasState } from '../../atoms';
import './Votes.less';
import { useRecoilState } from 'recoil';
import { v4 as uuid } from 'uuid';
import {calcVotesToLynch} from '../../helper';

const Votes = () => {
  const selectedGame = useRecoilValue(selectedGameState);
  const [gameVotes, loading] = useGameVotes();
  const [selectedTab, setSelectedTab] = useState('tab-day1');
  const [formattedVotes, setFormattedVotes] = useState('');
  const [displayVotes, setDisplayVotes] = useState([]);
  const [aliases, setAliases] = useRecoilState(playerAliasState);

  useEffect(() => {
    setSelectedTab('tab-day1');
  }, [selectedGame]);

  useLayoutEffect(() => {
    setDisplayVotes([]);
    setFormattedVotes([]);

    if (gameVotes?.length) {
      const day = +selectedTab.replace('tab-day', '') - 1;
      let newFormattedVotes = [];
      let notVoting = [];
      
      const numActivePlayers = gameVotes[day].players.filter(p => !p.isDead).length;
      const votesToLynch = calcVotesToLynch(numActivePlayers);

      newFormattedVotes.push(`${votesToLynch} votes needed to lynch\r\n`);

      let newDisplayVotes = produce(gameVotes, draft => {
        for (let i = 0; i < gameVotes[day].players.length; ++i) {
          const player = gameVotes[day].players[i];
          if (player.isDead) continue;

          if (player.votesFrom.length) {
            draft[day].players[i].formatted = <span><b>{player.name}</b> -{player.votesFrom.length}- <i>{player.votesFrom.join(', ')}</i> {`(L-${votesToLynch - player.votesFrom.length})`}</span>;
            newFormattedVotes.push(`<b>${player.name}</b> -${player.votesFrom.length}- <i>${player.votesFrom.join(', ')}</i> (L-${votesToLynch - player.votesFrom.length})`)
          }
          
          if (!player.vote || !player.isValidVote) {
            notVoting.push(player.name);
          }
        }
      })

      if (notVoting.length) {
        if (newFormattedVotes.length > 1) {
          newFormattedVotes.push('');
        }

        newFormattedVotes.push(`<b>Players not voting</b>: <i>${notVoting.join(', ')}</i>`);
      }

      setDisplayVotes(newDisplayVotes);
      setFormattedVotes(newFormattedVotes.join('\r\n'));
    }
  }, [gameVotes, selectedTab]);

  const updateAliasClicked = alias => ({key: player}) => {
    if (aliases.some(a => a.name ===  player)) {
      setAliases(
        aliases.map(a => a.name === player ? { ...a, aliases: a.aliases + `, ${alias}` } : a)
      );
    } else {
      const newPlayer = {key: uuid(), name: player, aliases: alias};
      setAliases([...aliases, newPlayer]);
    }
  }

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
    render: (text, record) => {
      if (!text) return null;

      const day = +selectedTab.replace('tab-day', '') - 1;
      const players = gameVotes[day]?.players ?? [];
      const isValidVote = !!players.find(p => p.name === record.name)?.isValidVote;
      if (isValidVote) return text;

      return (
        <Dropdown trigger={['click']} overlay={
          <Menu onClick={updateAliasClicked(text)}>
            {
              players.map(p => (
                <Menu.Item key={p.name}>
                  {p.name}
                </Menu.Item>
              ))
            }
          </Menu>
        }>
          <Button style={{width: '100%'}}>
            <Row style={{alignItems: 'center'}}>
              <span>{text}</span>
              <DownOutlined style={{marginLeft: 'auto'}} />
            </Row>
          </Button>
        </Dropdown>
      );
    },
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