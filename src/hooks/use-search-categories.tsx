import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { DropDownOption } from '@/components/drop-down-options/drop-down-options';
import { Deck } from '@/models/deck';
import { PublicUser } from '@/models/public-user';
import { paths } from '@/routing/paths';
import { userDecksSortedState, userDecksState } from '@/state/user-decks';
import { usersState } from '@/state/users';
import { useDecksClient } from './api/use-decks-client';
import { usePublicUsersClient } from './api/use-public-users-client';
import { useSearchResultFilter } from './use-search-result-filter';

export interface CategorySearchResults {
  'my decks': Deck[] | undefined;
  'public decks': Deck[] | undefined;
  users: PublicUser[] | undefined;
}

const ALL_SEARCH_CATEGORIES = ['my decks', 'public decks', 'users'] as const;
export type SearchCategory = typeof ALL_SEARCH_CATEGORIES[number];

export const useSearchCategories = (isCaseSensitive: boolean) => {
  const [searchCategory, setSearchCategory] = useState(getSearchCategories()[0]);
  const [searchValue, setSearchValue] = useState('');

  const { stringArrayIncludesValue } = useSearchResultFilter(isCaseSensitive);

  // My Decks
  const { getAllDecks } = useDecksClient();
  const setUserDecks = useSetRecoilState(userDecksState);
  const decks = useRecoilValue(userDecksSortedState);

  // Users
  const { getPublicUsers } = usePublicUsersClient();
  const [users, setUsers] = useRecoilState(usersState);

  const navigate = useNavigate();

  const categorySearchResults = getFilteredCategorySearchResults();
  const searchResultDropdownOptions = getFilteredDropdownOptions(categorySearchResults);
  const searchCategories = getSearchCategories();
  console.log('rerendered');
  return {
    searchValue,
    categorySearchResults,
    searchResultDropdownOptions,
    searchCategory,
    searchCategories,
    setSearchValue: handleSearchValueChange,
    setSearchCategory: handleSearchCategoryChange,
    navigateToResult,
  };

  function handleSearchValueChange(searchValue: string) {
    setSearchValue(searchValue);

    // TODO: We could use debouncing here, but since the dependencies are changing every render,
    // we need to memoize them
    fetchResources(searchCategory.id);
  }

  function handleSearchCategoryChange(categoryDropdown: DropDownOption<SearchCategory, string>) {
    setSearchCategory(categoryDropdown);
    fetchResources(categoryDropdown.id);
  }

  function navigateToResult(category: SearchCategory, id: string) {
    if (category === 'my decks') {
      navigate(`${paths.deck}/${id}`);
    }
    // TODO: Add navigation to user and public deck pages
  }

  async function fetchResources(category: SearchCategory) {
    if (category === 'my decks' && decks === undefined) {
      const decks = await getAllDecks();
      setUserDecks(decks);
    }
    if (category === 'users' && users === undefined) {
      console.log('started');
      const users = await getPublicUsers();
      setUsers(users);
      console.log('finished');
    }

    // TODO: fetch public Decks
  }

  function getSearchCategories(): DropDownOption<SearchCategory, string>[] {
    return ALL_SEARCH_CATEGORIES.map((c) => ({ id: c, value: c, focusable: true }));
  }

  function getFilteredCategorySearchResults(): CategorySearchResults {
    // TODO: I wanted to export the search results without having to check the types on the other side
    // if this is too slow we can switch only filtering one at a time and checking type when consuming
    return {
      'my decks': getFilteredDecks(),
      'public decks': getFilteredDecks(),
      users: getFilteredUsers(),
    };
  }

  function getFilteredDropdownOptions(searchResults: CategorySearchResults) {
    const results: Record<SearchCategory, DropDownOption<string, string>[] | undefined> = {
      'my decks': searchResults['my decks']?.map(deckToDropdownOption),
      'public decks': searchResults['public decks']?.map(deckToDropdownOption),
      users: searchResults['users']?.map(userToDropdownOption),
    };
    return results[searchCategory.id];
  }

  function getFilteredUsers() {
    return users?.filter((users) => {
      const userSearchFields = [users.username];
      return stringArrayIncludesValue(userSearchFields, searchValue);
    });
  }

  function getFilteredDecks() {
    return decks?.filter((deck) => {
      const deckSearchFields = [deck.metaData.title];
      return stringArrayIncludesValue(deckSearchFields, searchValue);
    });
  }

  function deckToDropdownOption(deck: Deck): DropDownOption<string, string> {
    const id = deck.metaData.id.toString();
    const value = deck.metaData.title;
    return { id, value, focusable: true };
  }

  function userToDropdownOption(user: PublicUser): DropDownOption<string, string> {
    const id = user.username;
    const value = user.username;
    return { id, value, focusable: true };
  }
};
