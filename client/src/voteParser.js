import { useEffect, useState } from 'react';
import { useRecoilValueLoadable } from 'recoil';
import { postsQuery } from './atoms';

export function useVotes() {
  const posts = useRecoilValueLoadable(postsQuery);
  const loading = posts.state === 'loading';
  const [players, setPlayers] = useState([]);
  const [votes, setVotes] = useState({});

  useEffect(() => {
    if (!loading) {
      const [p, v] = parsePosts(posts.contents);
      setPlayers(p || []);
      setVotes(v || {});
    }
  }, [loading, posts.contents]);

  return [players, votes];
}

function parsePosts(posts) {
  if (!posts || !posts.length) return [];

  const op = posts[0].name;
  const players = parsePlayers(posts[0].post);
  const votes = {};

  let day = false;
  let dayCount = 0;

  for (let i = 1; i < posts.length; ++i) {
    const {name, post: text} = posts[i];
    
    if (name === op) {
      if (!day && isDay(text)) {
        day = true;
        dayCount++;
      }
      else if (day && isNight(text)) {
        day = false;
      }
    } else {
      const validPlayer = players.some(p => p == name);

      if (validPlayer && day) {
        let currentDaysVotes = votes[dayCount];
        if (currentDaysVotes === undefined) {
          currentDaysVotes = votes[dayCount] = {};
        }

        const currentPlayersVote = currentDaysVotes[name];

        votes[dayCount][name] = parsePlayerVotes(text, currentPlayersVote);
      }
    }
  }

  return [players, votes];
}

function isDay(post) {
  return post.search(/it's day/gi) !== -1;
}

function isNight(post) {
  return post.search(/it's night/gi) !== -1;
}

function parsePlayerVotes(post, currentVote = '') {
  let vote = currentVote;

  const matches = post.matchAll(/<b>((?<un>un)?vote:? ?(?<name>.*?)|(?<unvote>unvote))<\/b>/gim);
  for (let match of matches) {
    const unvote = !!match.groups.un || !!match.groups.unvote;
    let name = (match.groups.name || '').trim();

    vote = name ? name.toLowerCase() : '';
  }

  return vote;
}

function parsePlayers(post) {
  const index = post.search(/player list/gi);
  const players = post.substring(index).split(/\r?\n/);
  const foundPlayers = [];

  let playerFound = false;
  for (let i = 1; i < players.length; ++i) {
    const player = players[i];

    if (!player || player.startsWith('<')) {
      if (playerFound) {
        break;
      } else {
        continue;
      }
    }

    playerFound = true;
    foundPlayers.push(player.toLowerCase());
  }

  return foundPlayers.sort();
}