import { compare, shuffle } from '../helpers/sort';
import { daysBetween } from '../helpers/time';
import { Card } from '../models/card';
import { Deck } from '../models/deck';

/**
 * Provides an interface that takes a deck and outputs a series of cards fit for study.
 * Spaced repetition is implemented via the 5-box Leitner System.
 *
 * Scoring is proportional to the index of the boxes (score of 0 = Box 1, score of 4 = Box 5).
 *   - If a card outcome is correct, it should be moved up a box.
 *   - If a card outcome is incorrect, it is moved to Box 1 regardless of its current position.
 *
 * Cards that are 'pooled' to be chosen from follow these criteria:
 *   - Cards in Box 1 are always candidate cards and are pooled
 *   - If it has been more than stale days since the card was last studied, it is pooled
 *   - Otherwise, it is not pooled unless specific settings controlling this has been set
 *
 * Defaults (via BoxStaleDays):
 * [Box 1]  [Box 2]  [Box 3]  [Box 4]  [Box 5]
 *   --       2d       5d       1wk      2wk
 */
export function useSpacedRepetition() {
  return { gatherStudyCards };

  /**
   * Pool `count` (N) number of cards from the deck.
   * If more cards are requested than there are, throw an exception.
   *
   * Otherwise, follow these heuristics:
   *   Split cards into two divisions: stale and unstale cards.
   *     - Add stale cards in a random order until we have N cards, then [[Return]]
   *     - If we don't have enough cards, [[Continue]]
   *   From the cards that *weren't* stale (unstale), order them by closest days until stale (smelly).
   *     - Add smelly cards until we have enough -- which should be guaranteed, [[Return]].
   */
  function gatherStudyCards(deck: Deck, count: number): Card[] {
    const pooledCards: Card[] = [];

    const cards = deck.cards;
    if (cards.length < count) {
      throw new Error(
        `Cannot pool ${count} cards when the deck only contains ${cards.length} cards`
      );
    }

    // reduce into two boxes: cards that can be pooled (stale) and ones that cannot (unstale/fresh)
    const { stale: staleCards, unstale: unstaleCards } = cards.reduce(
      (result: Record<'stale' | 'unstale', Card[]>, card: Card) => {
        const isStale = getDaysUntilStale(card) <= 0;
        const key = isStale ? 'stale' : 'unstale';
        result[key].push(card);
        return result;
      },
      { stale: [], unstale: [] }
    );

    // add those cards from the pool until we have enough
    for (const card of shuffle(staleCards)) {
      pooledCards.push(card);

      if (pooledCards.length == count) {
        return pooledCards;
      }
    }

    // if we don't have enough cards that were poolable (stale),
    // we sort unstale cards by 'days until stale' (smelly) and pick amongst them
    // also, we shuffle to introduce randomness since sort is a stable sort (TimSort)
    const smellyCards = shuffle(unstaleCards).sort((card1, card2) => {
      return compare(getDaysUntilStale(card1), getDaysUntilStale(card2));
    });

    // add the smelly cards until we have enough
    for (const card of smellyCards) {
      pooledCards.push(card);

      if (pooledCards.length == count) {
        return pooledCards;
      }
    }

    // we should be guaranteed to never hit here
    // but control flow is none the wiser
    return pooledCards;
  }
}

type Box = 'BOX1' | 'BOX2' | 'BOX3' | 'BOX4' | 'BOX5';

// box number -> days before added to the pool
export const BoxStaleDays: Record<Box, number> = {
  BOX1: 0,
  BOX2: 2,
  BOX3: 5,
  BOX4: 7,
  BOX5: 14,
};

export const MAX_SCORE = Object.keys(BoxStaleDays).length - 1;

export function scoreToBox(score: number): Box {
  // shouldn't really happen, but just as a fail-safe
  if (score > MAX_SCORE) {
    return 'BOX5';
  }

  switch (score) {
    case 0:
      return 'BOX1';
    case 1:
      return 'BOX2';
    case 2:
      return 'BOX3';
    case 3:
      return 'BOX4';
    case 4:
      return 'BOX5';

    default:
      return 'BOX1';
  }
}

export function getDaysUntilStale(card: Card) {
  // BOX1 cards are always stale
  if (card.score === 0) {
    return 0;
  }

  // TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO
  // TODO TODO TODO TODO TODO
  const dateNow = new Date(); // TODO: time needs to match timezone with server.
  // TODO TODO TODO TODO TODO
  // TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO

  const box = scoreToBox(card.score);
  const daysUntilPoolable = BoxStaleDays[box];
  const daysLastStudied = daysBetween(dateNow, card.dateUpdated);
  const daysUntilStale = daysUntilPoolable - daysLastStudied;
  return daysUntilStale;
}
