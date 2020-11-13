import React from 'react';
import { killPatternState } from '../../atoms';
import RegexMatchFinder from './RegexMatchFinder';

const KillPatterns = () => (
  <RegexMatchFinder patternState={killPatternState} />
);

export default KillPatterns;