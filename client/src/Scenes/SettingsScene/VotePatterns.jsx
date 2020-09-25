import React from 'react';
import { votePatternState } from '../../atoms';
import RegexMatchFinder from './RegexMatchFinder';

const VotePatterns = () => (
  <RegexMatchFinder patternState={votePatternState} />
);

export default VotePatterns;