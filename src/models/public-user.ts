import { Deck, JsonToDeck } from './deck';

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface PublicUser {
  username: string;
  publicDecks: Deck[];
}

export function JsonToPublicUser(obj: any): PublicUser {
  return {
    username: obj.username,
    publicDecks: obj.decks.map(JsonToDeck),
  };
}
