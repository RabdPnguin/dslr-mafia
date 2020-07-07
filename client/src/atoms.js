import { atom, selector } from 'recoil';
import axios from 'axios';

export const playersState = atom({
  key: 'players',
  default: [],
  persistence_UNSTABLE: {
    type: 'players'
  }
});

export const gamesQuery = selector({
  key: 'games',
  get: async () => {
    const result = await axios.get('/games');
    return result.data;
  }
});