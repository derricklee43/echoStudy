import { Language } from './card-content';
import { Card } from './card';

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
