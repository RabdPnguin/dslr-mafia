import React from 'react';
import { dayKillPatternState } from '../../atoms';
import RegexMatchFinder from './RegexMatchFinder';

const DayKillPatterns = () => (
  <RegexMatchFinder patternState={dayKillPatternState} />
);

export default DayKillPatterns;