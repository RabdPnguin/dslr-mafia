import { atom } from 'recoil';

export const playersState = atom({
  key: 'players',
  default: [{
    id: 1,
    name: 'rabidpenguin',
    aliases: 'rp, rabid'
  }, {
    id: 2,
    name: 'El Quintron',
    aliases: 'elq'
  }, {
    id: 3,
    name: 'Chaplain',
    aliases: 'chap'
  }]
});