import { Deck } from './Deck';

export interface DeckCategory {
  id: number;
  title: string;
  desc: string;
  decks: Deck[];
}
