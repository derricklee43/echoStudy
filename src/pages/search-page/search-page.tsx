import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { DeckTile } from '@/components/deck-tile/deck-tile';
import { LoadingPage } from '@/components/loading-page/loading-page';
import { PageHeader } from '@/components/page-header/page-header';
import { CategorySearchBar } from '@/components/search-bar/category-search-bar/category-search-bar';
import { UserTile } from '@/components/user-tile/user-tile';
import { usePublicUsersClient } from '@/hooks/api/use-public-users-client';
import { useSearchCategories } from '@/hooks/use-search-categories';
import { PublicUser } from '@/models/public-user';
import { userDecksSortedState } from '@/state/user-decks';
import './search-page.scss';

export const SearchPage = () => {
  const {
    searchValue,
    searchResults,
    searchCategory,
    searchCategories,
    isLoading,
    setSearchValue,
    setSearchCategory,
    navigateToResult,
  } = useSearchCategories(false);
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(false); //TODO: remove
  const { getPublicUsers } = usePublicUsersClient();
  const decks = useRecoilValue(userDecksSortedState);

  useEffect(() => {
    fetchUsers();
  }, []);

  const placeholder = `search ${searchCategory.id}...`;
  return (
    <div>
      <PageHeader label="search" />
      <CategorySearchBar
        searchValue={searchValue}
        selectedCategory={searchCategory}
        searchCategories={searchCategories}
        placeholder={placeholder}
        onSearchValueChange={setSearchValue}
        onCategorySelect={setSearchCategory}
        className="search-page-category-search-bar"
      />
      {getResultsContent()}
    </div>
  );

  function getResultsContent() {
    if (isLoading) {
      return getLoadingIcon();
    }
    // TODO: uncomment
    // if (searchResults.length === 0) {
    //   return getNoResultsMessage();
    // }
    return getSearchResults();
  }

  // TODO: maybe remove
  function getLoadingIcon() {
    return <LoadingPage label="loading search results" className="search-page-loading-icon" />;
  }

  function getNoResultsMessage() {
    return <div className="search-page-no-results-message">no results found...</div>;
  }

  function getSearchResults() {
    if (searchCategory.id === 'users') {
      return getUserTiles();
    }

    if (searchCategory.id === 'my decks') {
      return getMyDeckTiles();
    }

    if (searchCategory.id === 'public decks') {
      return getPublicDeckTiles();
    }
  }

  function getUserTiles() {
    return (
      <div className="search-page-user-tiles">
        {users.map((user) => (
          <UserTile key={user.username} user={user} />
        ))}
      </div>
    );
  }
  function getPublicDeckTiles() {
    const deckTiles = decks.map((deck) => {
      return (
        <DeckTile
          key={deck.metaData.id}
          title={deck.metaData.title}
          description={deck.metaData.desc}
          numCards={deck.cards.length}
          author="Tim Burton"
        />
      );
    });
    return <div className="search-page-public-deck-tiles">{deckTiles}</div>;
  }

  function getMyDeckTiles() {
    const deckTiles = decks.map((deck) => {
      return (
        <DeckTile
          key={deck.metaData.id}
          title={deck.metaData.title}
          description={deck.metaData.desc}
          numCards={deck.cards.length}
        />
        // <DeckCover
        //   key={deck.metaData.id}
        //   flippable={true}
        //   deck={deck}
        //   onClick={noop}
        //   onStudyClick={noop}
        //   onViewClick={noop}
        // />
      );
    });
    return <div className="search-page-my-deck-tiles">{deckTiles}</div>;
  }

  async function fetchUsers() {
    setLoading(true);
    const users = await getPublicUsers();
    console.log(users);
    setUsers(users);
    setLoading(false);
  }
};
