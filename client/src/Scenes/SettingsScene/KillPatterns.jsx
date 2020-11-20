import { Switch } from 'antd';
import React from 'react';
import { useRecoilState } from 'recoil';
import { killPatternState } from '../../atoms';
import RegexMatchFinder from './RegexMatchFinder';

const KillPatterns = () => {
  const [patterns, setPatterns] = useRecoilState(killPatternState);

  const resetVotesChanged = key => {
    setPatterns(patterns.map(p => {
      if (p.key !== key) return p;
      return {
        ...p,
        resetVotes: !p.resetVotes
      }
    }));
  };

  const columns = [{
    title: 'Reset Votes',
    dataIndex: 'resetVotes',
    width: '20%',
    render: (text, record) => {
      const checked = patterns.find(p => p.key === record.key)?.resetVotes ?? false;
      return <Switch checked={checked} onChange={() => resetVotesChanged(record.key)} />;
    }
  }];

  return (
    <RegexMatchFinder
      patternState={killPatternState}
      columns={columns} />
  );
};

export default KillPatterns;