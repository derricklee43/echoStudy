import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { DropDownOption } from '@/components/drop-down-options/drop-down-options';
import { SearchResult } from '@/components/search-bar/base-search-bar/base-search-bar';
import { noop } from '@/helpers/func';
import { paths } from '@/routing/paths';
import { userDecksSortedState, userDecksState } from '@/state/user-decks';
import { useDecksClient } from './api/use-decks-client';
import { useSearchResultFilter } from './use-search-result-filter';

const ALL_SEARCH_CATEGORIES = ['my decks', 'public decks', 'users'] as const;
type SearchCategory = typeof ALL_SEARCH_CATEGORIES[number];

function getSearchCategories() {
  const categories: DropDownOption<SearchCategory, string>[] = ALL_SEARCH_CATEGORIES.map(
    (category) => ({
      id: category,
      value: category,
      focusable: true,
    })
  );
  return categories;
}

export const useSearchCategories = () => {
  const decksClient = useDecksClient();
  const setUserDecks = useSetRecoilState(userDecksState); // global user decks
  const decks = useRecoilValue(userDecksSortedState);
  const navigate = useNavigate();
  const [category, setCategory] = useState(getSearchCategories()[0]);
  const { filterSearchResults } = useSearchResultFilter(false);
  const [value, setValue] = useState('');
  const [results, setResults] = useState<SearchResult<string, string>[]>([]);
  const searchCategories = getSearchCategories();

  useEffect(() => {
    if (decks === undefined) {
      fetchDecksAndRefresh();
    }
  }, []);

  return {
    searchValue: value,
    searchResults: results,
    searchCategory: category,
    searchCategories,
    setSearchValue,
    setSearchCategory,
  };

  function getCategoryResults(category: SearchCategory) {
    const allPublicDecks: SearchResult<string, string>[] = [];
    const allUsers: SearchResult<string, string>[] = [];
    const allPrivateDecks: SearchResult<string, string>[] = decks.map((deck) => {
      const id = deck.metaData.id.toString();
      return {
        id,
        value: deck.metaData.title,
        focusable: true,
        onSelect: () => navigate(`${paths.deck}/${id}`),
      };
    });

    const allResults: Record<SearchCategory, SearchResult<string, string>[]> = {
      'public decks': allPublicDecks,
      'my decks': allPrivateDecks,
      users: allUsers,
    };
    return allResults[category];
  }

  function setSearchCategory(searchCategory: DropDownOption<SearchCategory, string>) {
    const allResults = getCategoryResults(searchCategory.id);
    const matchingResults = filterSearchResults(allResults, value);
    setResults(matchingResults);
    setCategory(searchCategory);
  }

  function setSearchValue(searchValue: string) {
    const allResults = getCategoryResults(category.id);
    const matchingResults = filterSearchResults(allResults, searchValue);
    setResults(matchingResults);
    setValue(searchValue);
  }

  async function fetchDecksAndRefresh() {
    const fetchedDecks = await decksClient.getAllDecks();
    setUserDecks(fetchedDecks);
  }

  function getLoadingSearchResult(): SearchResult<string, ReactNode> {
    return {
      id: 'loading',
      value: <div></div>,
      focusable: false,
      onSelect: noop,
    };
  }
};
