import { atom } from 'recoil';

export const playersState = atom({
  key: 'players',
  default: [],
  persistence_UNSTABLE: {
    type: 'players'
  }
});