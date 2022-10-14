import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useDecksClient } from './api/use-decks-client';
import { useSearchResultFilter } from './use-search-result-filter';
import { DropDownOption } from '../components/drop-down-options/drop-down-options';
import { SearchResult } from '../components/search-bar/base-search-bar/base-search-bar';
import { paths } from '../routing/paths';
import { userDecksState } from '../state/user-decks';

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
  const [myDecks, setMyDecks] = useRecoilState(userDecksState); // global user decks
  const navigate = useNavigate();
  const [category, setCategory] = useState(getSearchCategories()[0]);
  const { filterSearchResults } = useSearchResultFilter(false);
  const [value, setValue] = useState('');
  const [results, setResults] = useState<SearchResult<string, string>[]>([]);
  const searchCategories = getSearchCategories();

  useEffect(() => {
    if (myDecks === undefined) {
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

  function navigateToPrivateDeck(deckId: string) {
    navigate(`${paths.deck}/${deckId}`);
  }

  function navigateToPublicDeck(deckId: string) {
    navigate(`${paths.deck}/${deckId}`);
  }

  function navigateToUser(userId: string) {
    navigate(`${paths.deck}/${userId}`);
  }

  function getAllCategoryResults() {
    const allPublicDecks: SearchResult<string, string>[] = [
      {
        id: 'deck1',
        value: 'publicDeck1',
        focusable: true,
        onSelect: () => navigateToPrivateDeck('deck1'),
      },
      {
        id: 'deck2',
        value: 'publicDeck2',
        focusable: true,
        onSelect: () => navigateToPrivateDeck('deck1'),
      },
      {
        id: 'deck3',
        value: 'publicDeck3',
        focusable: true,
        onSelect: () => navigateToPrivateDeck('deck1'),
      },
    ];
    const allPrivateDecks: SearchResult<string, string>[] = myDecks.map((deck) => {
      const id = deck.metaData.id.toString();
      return {
        id,
        value: deck.metaData.title,
        focusable: true,
        onSelect: () => navigateToPrivateDeck(id),
      };
    });

    const allUsers: SearchResult<string, string>[] = [
      {
        id: 'user1',
        value: 'user1',
        focusable: true,
        onSelect: () => navigateToPrivateDeck('deck1'),
      },
      {
        id: 'user2',
        value: 'user2',
        focusable: true,
        onSelect: () => navigateToPrivateDeck('deck1'),
      },
      {
        id: 'user3',
        value: 'user3',
        focusable: true,
        onSelect: () => navigateToPrivateDeck('deck1'),
      },
    ];

    const allResults: Record<SearchCategory, SearchResult<string, string>[]> = {
      'public decks': allPublicDecks,
      'my decks': allPrivateDecks,
      users: allUsers,
    };
    return allResults;
  }

  function setSearchCategory(searchCategory: DropDownOption<SearchCategory, string>) {
    const allResults = getAllCategoryResults();
    const matchingResults = filterSearchResults(allResults[searchCategory.id], value);
    setResults(matchingResults);
    setCategory(searchCategory);
  }

  function setSearchValue(searchValue: string) {
    const allResults = getAllCategoryResults();
    const matchingResults = filterSearchResults(allResults[category.id], searchValue);
    setResults(matchingResults);
    setValue(searchValue);
  }

  async function fetchDecksAndRefresh() {
    const fetchedDecks = await decksClient.getAllDecks();
    setMyDecks(fetchedDecks);
  }
};
