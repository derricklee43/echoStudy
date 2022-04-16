import { Card } from './card';

export const DeckLanguages = ['English', 'Spanish', 'German', 'Japanese'] as const;

export type Language = typeof DeckLanguages[number];

export type Access = 'Public' | 'Private';

export interface DeckMetaData {
  id: number;
  title: string;
  desc: string;
  access: Access;
  frontLang: Language;
  backLang: Language;
  ownerId: string;
  dateCreated: Date;
  dateUpdated: Date;
  dateTouched: Date;
}
export interface Deck {
  metaData: DeckMetaData;
  cards: Card[];
}

export function createNewDeck(): Deck {
  const metaData: DeckMetaData = {
    id: -1,
    title: '',
    desc: '',
    access: 'Private',
    frontLang: 'English',
    backLang: 'English',
    ownerId: 'unknown-user',
    dateCreated: new Date(),
    dateUpdated: new Date(),
    dateTouched: new Date(),
  };
  return { cards: [], metaData };
}
