import { Deck } from './deck';

export interface DeckCategory {
  id: number;
  title: string;
  desc: string;
  decks: Deck[];
}
