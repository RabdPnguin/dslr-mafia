import { atom, selector } from 'recoil';
import axios from 'axios';
import { resolveOnChange } from 'antd/lib/input/Input';

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

    const result = await axios.get(`/games/${get(selectedGameState)}/players`);
    return result.data || [];
  }
});

function waitAndResolve(value) {
  return new Promise(resolve => {
    setTimeout(() => { resolve(value); }, 1);
  });
}