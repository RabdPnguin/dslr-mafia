import React from 'react';
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
  const alias = useRecoilValue(aliasState);

  const rawVotesByDay = loading
    ? []
    : Object.entries(rawVotes).map(([day, votes]) => ({day, votes}));

  return (
    <Tabs>
      {rawVotesByDay.map(({day, votes}) => {
        const playerVotes = Object.entries(votes)
          .map(([player, vote]) => ({player, vote}))
          .sort((a, b) => a.player.localeCompare(b.player));

        return (
          <Tabs.TabPane key={day} tab={`Day ${day}`}>
            <DataGrid
              loading={loading}
              columns={rawDataColumns}
              dataSource={playerVotes}
              rowKey='player'
            />
          </Tabs.TabPane>
        );
      })}
    </Tabs>
  );
};

export default PlayerDataGrid;