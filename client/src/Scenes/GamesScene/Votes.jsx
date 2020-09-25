import React, {useEffect, useState, useRef} from 'react';
// import { useRecoilValue } from 'recoil';
// import { aliasState } from '../../atoms';
import useGameVotes from '../../hooks/useGameVotes';
// import DataGrid from '../../components/DataGrid';
import { Tabs, Empty, Skeleton } from 'antd';
import {selectedGameState} from '../../atoms';
import { useRecoilValue } from 'recoil';
// import './Votes.less';

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
        {gameVotes.map(({day}) => (
          <Tabs.TabPane key={`tab-day${day}`} tab={`Day ${day}`}>

          </Tabs.TabPane>))
        }
      </Tabs>
    </>
  );
};

// const rawDataColumns = [{
//   title: 'Player',
//   dataIndex: 'player',
//   width: 200
// }, {
//   title: 'Vote',
//   dataIndex: 'vote',
//   width: 200
// }, {
//   title: 'Formatted',
//   dataIndex: 'formatted'
// }];

// const Votes = () => {
//   const [players, rawVotes, rawDeadPlayers, loading] = useVotes();
//   const aliases = useRecoilValue(aliasState);
//   const [formattedVotes, setFormattedVotes] = useState([]);
//   const deadPlayers = useRef(new Set());

//   useEffect(() => {
//     if (!loading && rawVotes) {
//       deadPlayers.current.clear();

//       setFormattedVotes(
//         Object.entries(rawVotes).map(([day, votes]) => {
//           const playerVotes = Object.entries(votes);

//           return {
//             day,
//             votes: playerVotes.map(([player, vote]) => {
//               const alias = aliases
//                 .find(a => a.name.toLowerCase() === player)
//                 ?.aliases.split(',')
//                 .map(a => a.toLowerCase().trim()) ?? [];

//               const votesAgainst = playerVotes
//                 .filter(([,v]) => v === player || alias.includes(v))
//                 .map(([p]) => p);

//               const totalVotesToLynch = Math.ceil((players.length - deadPlayers.current.size) / 2);
//               const votesLeftToLynch = totalVotesToLynch - votesAgainst.length;
              
//               const formatted = votesAgainst.length
//                   ? <span><b>{player}</b> -{votesAgainst.length}- <i>{votesAgainst.join(', ')}</i> {`(L-${votesLeftToLynch})`}</span>
//                   : null;

//               if (votesLeftToLynch === 0 || player === rawDeadPlayers[day] || alias.includes(rawDeadPlayers[day])) {
//                 deadPlayers.current.add(player);
//               }

//               return {
//                 player,
//                 vote,
//                 formatted
//               }
//             })
//             .sort((a, b) => a.player.localeCompare(b.player)),
//           }})
//       );
//     }
//   }, [rawVotes]);

//   return (
//     <Tabs>
//       {formattedVotes.map(({day, votes}) => (
//           <Tabs.TabPane key={day} tab={`Day ${day}`}>
//             <DataGrid
//               loading={loading}
//               columns={rawDataColumns}
//               dataSource={votes}
//               rowKey='player'
//             />
//           </Tabs.TabPane>
//       ))}
//     </Tabs>
//   );
// };

export default Votes;