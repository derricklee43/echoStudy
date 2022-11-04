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

export function cardToJson(card: Card, deckId?: number) {
  return {
    frontText: card.front.text,
    backText: card.back.text,
    frontLang: card.front.language,
    backLang: card.back.language,
    cardId: card.id, // required when updating cards
    frontAudio: deckId,
  };
}

export function JsonToCard(obj: any): Card {
  console.log(obj);
  const card = createNewCard();
  card.id = obj['id'];
  card.score = obj['score'];
  card.dateCreated = asUtcDate(obj['date_created']);
  card.dateUpdated = asUtcDate(obj['date_updated']);
  card.dateTouched = asUtcDate(obj['date_touched']);

  const frontCustomAudioUrl = obj['faudCustom'];
  card.front = {
    language: obj['flang'],
    text: obj['ftext'],
    audio: new LazyAudio(ensureHttps(obj['faud'])),
    customAudio: frontCustomAudioUrl ? new LazyAudio(ensureHttps(obj['faudCustom'])) : undefined,
  };

  const backCustomAudioUrl = obj['baudCustom'];
  card.back = {
    language: obj['blang'],
    text: obj['btext'],
    audio: new LazyAudio(ensureHttps(obj['baud'])),
    customAudio: backCustomAudioUrl ? new LazyAudio(ensureHttps(backCustomAudioUrl)) : undefined,
  };
  return card;
}
