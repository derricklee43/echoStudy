import { atom } from 'recoil';
import { Deck } from '@/models/deck';

// mutable: raw user decks
export const publicDecksState = atom<Deck[] | undefined>({
  key: 'publicDecksState',
  default: undefined,
});
