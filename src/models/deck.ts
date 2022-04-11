import { Card } from './card';

export const DeckLanguages = ['English', 'Spanish', 'German', 'Japanese'] as const;

export type Language = typeof DeckLanguages[number];

export type Access = 'Public' | 'Private';

export interface Deck {
  id: number;
  title: string;
  desc: string;
  access: Access;
  frontLang: Language;
  backLang: Language;
  cards: Card[];
}
