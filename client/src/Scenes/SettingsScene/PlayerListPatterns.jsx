import React from 'react';
import { playerListPatternState } from '../../atoms';
import RegexMatchFinder from './RegexMatchFinder';

const PlayerListPatterns = () => (
  <RegexMatchFinder patternState={playerListPatternState} />
);

export default PlayerListPatterns;