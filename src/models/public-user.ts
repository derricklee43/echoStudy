import { Deck } from './deck';

// highly WIP, refers to EchoUser
// iterate on this as backend is created [MS Identity]
export interface PublicUser {
  username: string;
  publicDecks: Deck[];
}
