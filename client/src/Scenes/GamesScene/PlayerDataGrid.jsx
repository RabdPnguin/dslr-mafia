import React, {useEffect, useState} from 'react';
import { useRecoilValue } from 'recoil';
import { aliasState } from '../../atoms';
import { useVotes } from '../../voteParser';
import DataGrid from '../../components/DataGrid';
import { Tabs } from 'antd';

const rawDataColumns = [{
  title: 'Player',
  dataIndex: 'player',
  width: 200
}, {
  title: 'Vote',
  dataIndex: 'vote',
  width: 200
}, {
  title: 'Formatted',
  dataIndex: 'formatted'
}];

const parsedDataColumns = [{
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
  const [players, rawVotes, loading] = useVotes();
  const aliases = useRecoilValue(aliasState);
  const [formattedVotes, setFormattedVotes] = useState([]);

  useEffect(() => {
    if (!loading) {
      setFormattedVotes(
        Object.entries(rawVotes).map(([day, votes]) => {
          const playerVotes = Object.entries(votes);

          return {
            day,
            votes: playerVotes.map(([player, vote]) => {
              console.log(player);
              console.log(aliases);
              const alias = aliases
                .find(a => a.name.toLowerCase() === player)
                ?.aliases.split(',')
                .map(a => a.toLowerCase().trim()) ?? [];

              const votesAgainst = playerVotes
                .filter(([,v]) => v === player || alias.includes(v))
                .map(([p]) => p);

              const Formatted = () => {
                if (votesAgainst.length) {
                  const totalVotesToLynch = Math.ceil(players.length / 2);
                  const votesLeftToLynch = totalVotesToLynch - votesAgainst.length;
                  return <span><b>{player}</b> -{votesAgainst.length}- <i>{votesAgainst.join(', ')}</i> {`(L-${votesLeftToLynch})`}</span>;
                } else {
                  return null;
                }
              }

              return {
                player,
                vote,
                formatted: <Formatted />
              }
            })
            .sort((a, b) => a.player.localeCompare(b.player)),
          }})
      );
    }
  }, [rawVotes]);

  return (
    <Tabs>
      {formattedVotes.map(({day, votes}) => (
          <Tabs.TabPane key={day} tab={`Day ${day}`}>
            <DataGrid
              loading={loading}
              columns={rawDataColumns}
              dataSource={votes}
              rowKey='player'
            />
          </Tabs.TabPane>
      ))}
    </Tabs>
  );
};

export default PlayerDataGrid;