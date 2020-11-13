import { atom, selector } from 'recoil';
import axios from 'axios';

export const playerAliasState = atom({
  key: 'playerAlias',
  default: [],
  persistence_UNSTABLE: {
    type: 'playerAlias'
  }
});

export const playerListPatternState = atom({
  key: 'playerListPattern',
  default: [],
  persistence_UNSTABLE: {
    type: 'playerListPattern'
  }
});

export const votePatternState = atom({
  key: 'votePattern',
  default: [],
  persistence_UNSTABLE: {
    type: 'votePattern'
  }
});

export const dayPatternState = atom({
  key: 'dayPattern',
  default: [],
  persistence_UNSTABLE: {
    type: 'dayPattern'
  }
});

export const nightPatternState = atom({
  key: 'nightPattern',
  default: [],
  persistence_UNSTABLE: {
    type: 'nightPattern'
  }
});

export const killPatternState = atom({
  key: 'killPattern',
  default: [],
  persistence_UNSTABLE: {
    type: 'killPattern'
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

export const postsQuery = selector({
  key: 'game-players',
  get: async ({ get }) => {
    const id = get(selectedGameState);
    if (!id) return [];

    try {
      const result = await axios.get(`/games/${get(selectedGameState)}/players`);
      return result.data;
    } catch (error) {
      console.error(error.response);
      return [];
    }
  }
});