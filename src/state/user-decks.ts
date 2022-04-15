import { atom, selector } from 'recoil';
import { compare, shuffle } from '../helpers/sort';
import { Deck } from '../models/deck';
import { testEnglishDeck } from '../models/mock/deck.mock';

// mutatable: raw user decks
export const userDecksState = atom<Deck[]>({
  key: 'userDecksState',
  default: [testEnglishDeck(0)],
});

export const SortRules = ['sequential', 'last created', 'random'] as const;
export type SortRule = typeof SortRules[number];

// mutatable: sort order
export const userDecksSortRuleState = atom<SortRule>({
  key: 'userDecksSortRuleState',
  default: 'last created',
});

// viewonly: user decks sorted by sort order (via `userDecksSortRule`)
export const userDecksSortedState = selector<Deck[]>({
  key: 'userDecksSortedState',
  get: ({ get }) => {
    const sortRule = get(userDecksSortRuleState); // readonly
    const getDecks = get(userDecksState); // readonly
    const decks = [...getDecks];

    switch (sortRule) {
      case 'sequential':
        return decks.sort(); // natural ordering

      case 'last created':
        return decks.sort((a, b) => compare(b.metaData.dateCreated, a.metaData.dateCreated)); // descending

      case 'random':
        return shuffle(decks);
    }
  },
  cachePolicy_UNSTABLE: {
    eviction: 'most-recent', // should evict when atoms since 'random' sort isn't determistic
  },
});
