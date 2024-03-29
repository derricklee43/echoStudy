import { atom, selector } from 'recoil';
import { compare, shuffle } from '@/helpers/sort';
import { Deck } from '@/models/deck';

export const AllSortRules = [
  'sequential',
  'last created',
  'last updated',
  'last studied',
  'random',
] as const;

export type SortRules = typeof AllSortRules;
export type SortRule = SortRules[number];

// mutable: raw user decks
export const userDecksState = atom<Deck[] | undefined>({
  key: 'userDecksState',
  default: undefined,
});

// mutable: sort order
export const userDecksSortRuleState = atom<SortRule>({
  key: 'userDecksSortRuleState',
  default: 'last created',
});

// viewonly: user decks sorted by sort order (via `userDecksSortRule`)
export const userDecksSortedState = selector<Deck[] | undefined>({
  key: 'userDecksSortedState',
  get: ({ get }) => {
    const sortRule = get(userDecksSortRuleState); // readonly
    const getDecks = get(userDecksState); // readonly
    if (getDecks === undefined) {
      return undefined;
    }

    const decks = [...getDecks];

    switch (sortRule) {
      case 'sequential':
        return decks.sort(); // natural ordering

      case 'last created':
        return decks.sort((a, b) => compare(b.metaData.dateCreated, a.metaData.dateCreated)); // descending

      case 'last updated':
        return decks.sort((a, b) => compare(b.metaData.dateUpdated, a.metaData.dateUpdated)); // descending

      case 'last studied':
        return decks.sort((a, b) => compare(b.metaData.dateTouched, a.metaData.dateTouched)); // descending

      case 'random':
        return shuffle(decks);
    }
  },
  cachePolicy_UNSTABLE: {
    eviction: 'most-recent', // should evict when atoms since 'random' sort isn't deterministic
  },
});
