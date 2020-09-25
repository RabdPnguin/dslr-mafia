import React from 'react';
import { nightPatternState } from '../../atoms';
import RegexMatchFinder from './RegexMatchFinder';

const NightPatterns = () => (
  <RegexMatchFinder patternState={nightPatternState} />
);

export default NightPatterns;