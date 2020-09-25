import React from 'react';
import { dayPatternState } from '../../atoms';
import RegexMatchFinder from './RegexMatchFinder';

const DayPatterns = () => (
  <RegexMatchFinder patternState={dayPatternState} />
);

export default DayPatterns;