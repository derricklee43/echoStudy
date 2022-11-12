import { asUtcDate } from '@/helpers/time';
import { Card, DraftCard } from './card';
import { DeckLanguage } from './language';

export type Access = 'Public' | 'Private';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DeckMetaData {
  id: number;
  title: string;
  desc: string;
  access: Access;
  frontLang: DeckLanguage;
  backLang: DeckLanguage;
  ownerId: string;
  ownerUsername: string;
  ownerProfilePicUrl: string;
  dateCreated: Date;
  dateUpdated: Date;
  dateTouched: Date;
  cardIds: number[];
  studiedPercent: number;
  masteredPercent: number;
}
export interface Deck {
  metaData: DeckMetaData;
  cards: Card[]; // not populated until individual cards fetched and put onto this object
}

export interface DraftDeck extends Deck {
  cards: DraftCard[];
}

export function deckToJson(deck: Deck) {
  return {
    title: deck.metaData.title,
    description: deck.metaData.desc,
    access: deck.metaData.access,
    default_flang: deck.metaData.frontLang,
    default_blang: deck.metaData.backLang,
  };
}

export function JsonToDeck(obj: any): Deck {
  return {
    metaData: {
      id: obj['id'],
      title: obj['title'],
      desc: obj['description'],
      access: obj['access'],
      frontLang: obj['default_flang'],
      backLang: obj['default_blang'],
      ownerId: obj['ownerId'],
      ownerUsername: obj['ownerUserName'],
      ownerProfilePicUrl: obj['owner_profile_pic'],
      dateCreated: asUtcDate(obj['date_created']),
      dateUpdated: asUtcDate(obj['date_updated']),
      dateTouched: asUtcDate(obj['date_touched']),
      studiedPercent: Math.round(obj['studiedPercent'] * 100),
      masteredPercent: Math.round(obj['masteredPercent'] * 100),
      cardIds: obj['cards'],
    },
    cards: [],
  };
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
    ownerUsername: 'unknown-username',
    ownerProfilePicUrl: 'unknown-profile-pic-url',
    studiedPercent: 0,
    masteredPercent: 0,
    dateCreated: new Date(),
    dateUpdated: new Date(),
    dateTouched: new Date(),
    cardIds: [],
  };
  return { cards: [], metaData };
}
