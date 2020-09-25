import { useState, useEffect } from 'react';
import { useRecoilValueLoadable } from 'recoil';
import { postsQuery } from '../atoms';

export default
function useGameVotes() {
  const posts = useRecoilValueLoadable(postsQuery);
  const loading = posts.state === 'loading';
  const [gameVotes, setGameVotes] = useState([]);

  useEffect(() => {
    if (!loading) {
      setGameVotes(parsePosts(posts.contents));
    }
  }, [loading, posts.contents]);

  return [gameVotes, loading];
}

function parsePosts(posts) {
  return [];
}