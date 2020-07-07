import { atom, selector } from 'recoil';
import axios from 'axios';

const port = process.env.PORT || 5000
const url = url => `http://localhost:${port}/${url}`;

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
    const result = await axios.get(url('games'));
    return result.data;
  }
});