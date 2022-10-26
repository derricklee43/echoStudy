import { asUtcDate } from '@/helpers/time';
import { Deck, JsonToDeck } from './deck';

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface PublicUser {
  username: string;
  publicDecks: Deck[];
  profilePicUrl: string;
  dateCreated: Date;
}

export function JsonToPublicUser(obj: any): PublicUser {
  return {
    username: obj['username'],
    profilePicUrl: obj['profilePicture'],
    publicDecks: obj['decks'].map(JsonToDeck),
    dateCreated: asUtcDate(obj['dateCreated']),
  };
}
