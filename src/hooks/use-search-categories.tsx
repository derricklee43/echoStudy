import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { DropDownOption } from '@/components/drop-down-options/drop-down-options';
import { Deck } from '@/models/deck';
import { paths } from '@/routing/paths';
import { userDecksSortedState, userDecksState } from '@/state/user-decks';
import { useDecksClient } from './api/use-decks-client';
import { useSearchResultFilter } from './use-search-result-filter';

const ALL_SEARCH_CATEGORIES = ['my decks', 'public decks', 'users'] as const;
type SearchCategory = typeof ALL_SEARCH_CATEGORIES[number];

export const useSearchCategories = (isCaseSensitive: boolean) => {
  const [searchCategory, setSearchCategory] = useState(getSearchCategories()[0]);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { filterSearchResults } = useSearchResultFilter(isCaseSensitive);

  const decksClient = useDecksClient();
  const setUserDecks = useSetRecoilState(userDecksState); // global user decks
  const decks = useRecoilValue(userDecksSortedState);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResources();
  }, []);

  const searchOptions = getSearchOptions();
  const searchResults = filterSearchResults(searchOptions[searchCategory.id], searchValue);

  return {
    searchValue,
    searchResults,
    searchCategory,
    searchCategories: getSearchCategories(),
    isLoading,
    setSearchValue,
    setSearchCategory,
    navigateToResult: navigateToResult,
  };

  function navigateToResult(searchResult: DropDownOption<string, ReactNode>) {
    if (searchCategory.id === 'my decks') {
      navigate(`${paths.deck}/${searchResult.id}`);
    }
  }

  async function fetchResources() {
    setIsLoading(true);
    const promises = [];
    if (decks.length === 0) {
      promises.push(fetchDecksAndRefresh());
    }
    // TODO: Add the other categories
    await Promise.all([promises]);
    setIsLoading(false);
  }

  async function fetchDecksAndRefresh() {
    try {
      const fetchedDecks = await decksClient.getAllDecks();
      setUserDecks(fetchedDecks);
    } catch (e) {
      console.warn(e);
    }
  }

  function getSearchOptions() {
    const options: Record<SearchCategory, DropDownOption<string, string>[]> = {
      'my decks': decks?.map(deckToSearchResult) ?? [],
      'public decks': [],
      users: [],
    };
    return options;
  }

  function deckToSearchResult(deck: Deck) {
    const id = deck.metaData.id.toString();
    const value = deck.metaData.title;
    return { id, value, focusable: true };
  }

  function getSearchCategories(): DropDownOption<SearchCategory, string>[] {
    return ALL_SEARCH_CATEGORIES.map((c) => ({ id: c, value: c, focusable: true }));
  }
};
