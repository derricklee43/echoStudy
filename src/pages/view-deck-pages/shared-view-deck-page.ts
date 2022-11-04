import { getFormattedDate } from '@/helpers/time';
import { Deck } from '@/models/deck';

export function getDeckBubbleTags(deck: Deck) {
  const tags = [
    `${deck.cards.length} cards`,
    `created ${getFormattedDate(deck.metaData.dateCreated)}`,
    `${deck.metaData.frontLang} terms`,
    `${deck.metaData.backLang} definitions`,
  ];
  return tags.map((tag) => ({ value: tag, key: tag }));
}
