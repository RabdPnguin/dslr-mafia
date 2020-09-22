import { atom, selector } from 'recoil';
import axios from 'axios';
import { current } from 'immer';

export const playersState = atom({
  key: 'players',
  default: [],
  persistence_UNSTABLE: {
    type: 'players'
  }
});

export const selectedGameState = atom({
  key: 'selected-game',
  default: null
});

export const gamesQuery = selector({
  key: 'games',
  get: async () => {
    const result = await axios.get('/games');
    return result.data;
  }
});

export const playersQuery = selector({
  key: 'game-players',
  get: async ({ get }) => {
    const id = get(selectedGameState);
    if (!id) return waitAndResolve([]);

    try {
      const result = await axios.get(`/games/${get(selectedGameState)}/players`);
      return parsePosts(result.data);
    } catch (error) {
      console.error(error.response);
      return [];
    }
  }
});

function waitAndResolve(value) {
  return new Promise(resolve => {
    setTimeout(() => { resolve(value); }, 1);
  });
}

function parsePosts(posts) {
  if (!posts && !posts.length) return [];

  const op = posts[0].name;
  const players = parsePlayers(posts[0].post);
  const votes = {};

  let day = false;
  let dayCount = 0;
  for (let post of posts) {
    const {name, post: text} = post;
    const currentVotes = votes[dayCount] || {};

    if (name === op) {
      if (isDay(text)) {
        day = true;
        dayCount++;
      }
      else if (isNight(text)) {
        day = false;
      }
    } else {
      if (!players.some(p => p.toLowerCase().includes(name.toLowerCase()))) {
        continue;
      }

      if (day) {
        const playerVotes = parsePlayerVotes(text, currentVotes);

        // for (let pv in playerVotes) {
        //   const v = currentVotes[pv] || [];
        //   for (let i = 0; i < playerVotes[pv]; ++i) {
        //     v.push(name);
        //   }
        // }
      }
    }
  }

  return votes;
}

function isDay(post) {
  return post.search(/it's day/gi) !== -1;
}

function isNight(post) {
  return post.search(/it's night/gi) !== -1;
}

function parsePlayerVotes(post, currentVotes) {
  const votes = new Map(Object.entries(currentVotes));

  const matches = post.matchAll(/<b>((?<un>un)?vote:? ?(?<name>.*?)|(?<unvote>unvote))<\/b>/gim);
  for (let match of matches) {
    const unvote = !!match.groups.un || !!match.groups.unvote;
    
    let name = (match.groups.name || '').trim();
    console.log(name);
    if (unvote && !name) {
      if (Object.keys(votes).length === 1) {
        votes.clear();
      } else {
        // cannot unvote. voting for more than 1 person and didn't specify name
        continue;
      }
    }

    let vote = votes.get(name) || 0;
    vote += unvote ? -1 : 1;
    votes.set(name, vote);
  }

  return Object.fromEntries(votes);
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
    foundPlayers.push(player);
  }

  return foundPlayers.sort();
}