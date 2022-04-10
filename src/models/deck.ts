import { Card } from './card';

const supportedDeckLanguages = getSupportedDeckLanguages();

export type Language = typeof supportedDeckLanguages[number];

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

export function getSupportedDeckLanguages() {
  return ['English', 'Spanish', 'German', 'Japanese'];
}
