import { Language } from './CardContent';
import { Card } from './Card';

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
