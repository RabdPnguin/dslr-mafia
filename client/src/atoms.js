import { atom } from 'recoil';
import { v4 as uuid } from 'uuid';

export const playersState = atom({
  key: 'players',
  default: [{
    key: uuid(),
    name: 'rabidpenguin',
    aliases: 'rp, rabid'
  }, {
    key: uuid(),
    name: 'El Quintron',
    aliases: 'elq'
  }, {
    key: uuid(),
    name: 'Chaplain',
    aliases: 'chap'
  }]
});