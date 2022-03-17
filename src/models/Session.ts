import { Deck } from './Deck';
import { User } from './User';

export type PlayOrder = 'Random' | 'Sequential';

export type PlayType = 'Learn' | 'Review';

export type Platform = 'Web';

export interface Session {
  id: number;
  playOrder: PlayOrder;
  playType: PlayType;
  maxCards: number;
  platform: Platform;
  device: string;
  user: User;
  deck: Deck;
}
