import { getFormattedDate } from '@/helpers/time';
import { Deck } from '@/models/deck';

export function getDeckTags(deck: Deck) {
  return [
    `${deck.cards.length} cards`,
    `${deck.metaData.frontLang} terms`,
    `${deck.metaData.backLang} definitions`,
    `created ${getFormattedDate(deck.metaData.dateCreated)}`,
  ];
}
