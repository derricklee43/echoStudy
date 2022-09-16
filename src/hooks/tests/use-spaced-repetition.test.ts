import { renderHook } from '@testing-library/react-hooks';
import { Card } from '../../models/card';
import { getTestFoxCard, getTestMonkeyCard, getTestMouseCard } from '../../models/mock/card.mock';
import { testEnglishDeck } from '../../models/mock/deck.mock';
import { BoxStaleDays, scoreToBox, useSpacedRepetition } from '../use-spaced-repetition';

describe('useSpacedRepetition', () => {
  const setup = () => {
    const deck = testEnglishDeck(0);
    const { result } = renderHook(() => useSpacedRepetition());
    const spacedRepetition = result.current;
    return { deck, spacedRepetition };
  };

  it('should yield study cards', () => {
    const { deck, spacedRepetition } = setup();
    const cards = [...Array(20)].map(() => getTestFoxCard());
    deck.cards = cards;

    expect(spacedRepetition.gatherStudyCards(deck, 20)).toHaveLength(20);
  });

  it('should yield study cards up to requested count', () => {
    const { deck, spacedRepetition } = setup();
    const cards = [...Array(25)].map(() => getTestFoxCard());
    deck.cards = cards;

    // requesting 20 from a 25 BOX1 (by default) cards
    expect(spacedRepetition.gatherStudyCards(deck, 20)).toHaveLength(20);
  });

  it('should throw if not enough cards for requested count', () => {
    const { deck, spacedRepetition } = setup();
    const cards = [...Array(10)].map(() => getTestFoxCard());
    deck.cards = cards;

    // requesting 20, but only 10 in there
    expect(() => spacedRepetition.gatherStudyCards(deck, 20)).toThrowError();
  });

  it('should always prioritize pooling stale cards', () => {
    const { deck, spacedRepetition } = setup();
    const staleFoxCards = [...Array(2)].map(() => getTestFoxCard());
    const unstaleMouseCards = [...Array(25)].map(() => getTestMouseCard(1));
    deck.cards = [...staleFoxCards, ...unstaleMouseCards];

    const gather = (count: number) => spacedRepetition.gatherStudyCards(deck, count);
    const areAllFoxCards = (cards: Card[]) => cards.every((card) => card.front.text === 'fox');

    // there are only 2 stale cards; both of which are fox cards
    expect(areAllFoxCards(gather(1))).toBe(true);
    expect(areAllFoxCards(gather(2))).toBe(true);
  });

  it('should take from unstale cards if not enough stale cards for requested count', () => {
    const { deck, spacedRepetition } = setup();
    const staleFoxCards = [...Array(25)].map(() => getTestFoxCard());
    const unstaleMouseCards = [...Array(25)].map(() => getTestMouseCard(4));
    deck.cards = [...staleFoxCards, ...unstaleMouseCards];

    const gather = (count: number) => spacedRepetition.gatherStudyCards(deck, count);
    const hasMouseCards = (cards: Card[]) => cards.some((card) => card.front.text === 'mouse');

    // N > 25 must contain some unstale (mouse) cards
    expect(hasMouseCards(gather(26))).toBe(true);
    expect(hasMouseCards(gather(50))).toBe(true);
  });

  it('should prioritize unstale cards based off days until stale', () => {
    const { deck, spacedRepetition } = setup();
    const staleFoxCards = [...Array(25)].map(() => getTestFoxCard());
    const unstaleMouseCards = [...Array(25)].map(() => getTestMouseCard(4, staleInDaysDate(4, 2))); // ~2 day until stale
    const unstaleMonkeyCard = [...Array(25)].map(() => getTestMonkeyCard(2, staleInDaysDate(2, 3))); // ~3 days until stale
    deck.cards = [...staleFoxCards, ...unstaleMouseCards, ...unstaleMonkeyCard];

    const gather = (count: number) => spacedRepetition.gatherStudyCards(deck, count);
    const onlyCardTexts = (texts: string[], cards: Card[]) =>
      cards.every((card) => texts.includes(card.front.text));

    // N <= 25 all fox
    expect(onlyCardTexts(['fox'], gather(1))).toBe(true);
    expect(onlyCardTexts(['fox'], gather(13))).toBe(true);
    expect(onlyCardTexts(['fox'], gather(25))).toBe(true);

    // 25 < N <= 50, has fox, mouse
    console.log(gather(26));
    expect(onlyCardTexts(['fox', 'mouse'], gather(26))).toBe(true);
    expect(onlyCardTexts(['fox', 'mouse'], gather(38))).toBe(true);
    expect(onlyCardTexts(['fox', 'mouse'], gather(50))).toBe(true);

    // N > 50, has fox, mouse, monkey
    expect(onlyCardTexts(['fox', 'mouse', 'monkey'], gather(51))).toBe(true);
    expect(onlyCardTexts(['fox', 'mouse', 'monkey'], gather(63))).toBe(true);
    expect(onlyCardTexts(['fox', 'mouse', 'monkey'], gather(75))).toBe(true);
  });
});

function staleInDaysDate(score: number, days: number): Date {
  const box = scoreToBox(score);
  const staleDays = BoxStaleDays[box];
  return getDateNumDaysAgo(staleDays - days);
}

function getDateNumDaysAgo(numDays: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - numDays);
  return date;
}
