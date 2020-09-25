import React from 'react';
import { nightKillPatternState } from '../../atoms';
import RegexMatchFinder from './RegexMatchFinder';

const NightKillPatterns = () => (
  <RegexMatchFinder patternState={nightKillPatternState} />
);

export default NightKillPatterns;