import { v4 as uuidv4 } from 'uuid';
import { ensureHttps } from '@/helpers/api';
import { asUtcDate } from '@/helpers/time';
import { isBlankString } from '@/helpers/validator';
import { CardContent, createNewCardContent } from './card-content';
import { LazyAudio } from './lazy-audio';

/* eslint-disable @typescript-eslint/no-explicit-any */

export type CardSide = 'front' | 'back';

export interface Card {
  id?: number;
  position?: number;
  key: string;
  front: CardContent;
  back: CardContent;
  score: number;
  dateCreated: Date;
  dateUpdated: Date;
  dateTouched: Date;
}

export interface DraftCard extends Card {
  frontCustomAudio?: Blob;
  backCustomAudio?: Blob;
}

export function createNewCard(): Card {
  return {
    front: createNewCardContent(),
    back: createNewCardContent(),
    key: uuidv4(),
    score: 0,
    dateCreated: new Date(),
    dateUpdated: new Date(),
    dateTouched: new Date(),
  };
}

export function filterBlankCards(card: Card) {
  return !isBlankString(card.front.text) && !isBlankString(card.back.text);
}

export function swapCardSides(card: DraftCard) {
  return {
    ...card,
    front: card.back,
    back: card.front,
    frontAudio: card.backCustomAudio,
    backAudio: card.frontCustomAudio,
  };
}

// TODO: this got messed up; fix it!
export async function cardToJson(draftCard: DraftCard, deckId?: number) {
  return {
    frontText: draftCard.front.text,
    backText: draftCard.back.text,
    frontLang: draftCard.front.language,
    backLang: draftCard.back.language,
    cardId: draftCard.id, // required when updating cards
    deckId: deckId,
    frontAudio: await customAudioToArray(draftCard.frontCustomAudio),
    backAudio: await customAudioToArray(draftCard.backCustomAudio),
  };
}

export function JsonToCard(obj: any): Card {
  const card = createNewCard();
  card.id = obj['id'];
  card.score = obj['score'];
  card.dateCreated = asUtcDate(obj['date_created']);
  card.dateUpdated = asUtcDate(obj['date_updated']);
  card.dateTouched = asUtcDate(obj['date_touched']);
  card.front = {
    language: obj['flang'],
    text: obj['ftext'],
    audio: getLazyAudio(obj['faud']),
    customAudio: getLazyAudio(obj['faudCustom'], true),
  };
  card.back = {
    language: obj['blang'],
    text: obj['btext'],
    audio: getLazyAudio(obj['baud']),
    customAudio: getLazyAudio(obj['baudCustom'], true),
  };
  return card;
}

async function customAudioToArray(customAudioBlob: Blob | undefined) {
  if (customAudioBlob === undefined) {
    return undefined;
  }
  const audioArrayBuffer = await customAudioBlob.arrayBuffer();
  return Array.from(new Uint8Array(audioArrayBuffer));
}

function getLazyAudio(url: string | undefined, allowUndefined = false) {
  if (url) {
    return new LazyAudio(ensureHttps(url));
  }
  if (allowUndefined) {
    return undefined;
  }
  throw Error('audio URL cannot be undefined');
}
