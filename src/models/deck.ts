import { Card } from './card';
import { DeckLanguage } from './language';

export type Access = 'Public' | 'Private';

export interface DeckMetaData {
  id: number;
  title: string;
  desc: string;
  access: Access;
  frontLang: DeckLanguage;
  backLang: DeckLanguage;
  ownerId: string;
  dateCreated: Date;
  dateUpdated: Date;
  dateTouched: Date;
  cardIds: number[];
}
export interface Deck {
  metaData: DeckMetaData;
  cards: Card[]; // not populated until individual cards fetched and put onto this object
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
    cardIds: [],
  };
  return { cards: [], metaData };
}
