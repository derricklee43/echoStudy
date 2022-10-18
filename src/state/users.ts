import { atom } from 'recoil';
import { PublicUser } from '@/models/public-user';

// mutable: raw user decks
export const usersState = atom<PublicUser[] | undefined>({
  key: 'usersState',
  default: undefined,
});
