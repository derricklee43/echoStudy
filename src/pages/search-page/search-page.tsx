import React from 'react';
import { DeckTile } from '@/components/deck-tile/deck-tile';
import { LoadingPage } from '@/components/loading-page/loading-page';
import { PageHeader } from '@/components/page-header/page-header';
import { CategorySearchBar } from '@/components/search-bar/category-search-bar/category-search-bar';
import { UserTile } from '@/components/user-tile/user-tile';
import { useSearchCategories } from '@/hooks/use-search-categories';
import './search-page.scss';

export const SearchPage = () => {
  const {
    searchValue,
    searchCategory,
    categorySearchResults,
    searchCategories,
    setSearchValue,
    setSearchCategory,
    navigateToResult,
  } = useSearchCategories(false);

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
    const searchResults = categorySearchResults[searchCategory.id];
    if (searchValue.trim() === '') {
      return undefined;
    }
    if (searchResults === undefined) {
      return getLoadingIcon();
    }
    if (searchResults.length === 0) {
      return getNoResultsMessage();
    }
    return searchCategory.id === 'users' ? getUserTiles() : getDeckTiles(searchCategory.id);
  }

  function getLoadingIcon() {
    return (
      <LoadingPage
        label={`searching ${searchCategory.id}...`}
        className="search-page-loading-icon"
      />
    );
  }

  function getNoResultsMessage() {
    return <div className="search-page-no-results-message">no results found...</div>;
  }

  function getUserTiles() {
    const users = categorySearchResults['users'];
    if (users === undefined) {
      return;
    }
    const userTiles = users.map((user) => (
      <UserTile
        key={user.username}
        user={user}
        onClick={() => navigateToResult('users', user.username)}
      />
    ));
    return <div className="search-page-user-tiles">{userTiles}</div>;
  }

  function getDeckTiles(category: 'my decks' | 'public decks') {
    const decks = categorySearchResults[category];
    if (decks === undefined) {
      return;
    }
    const showAuthor = category === 'public decks';
    const deckTiles = decks.map((deck) => {
      const author = showAuthor ? deck.metaData.ownerId : undefined; // TODO: Ask Mason or Jon to add the author email and replace
      const id = deck.metaData.id.toString();
      return (
        <DeckTile
          key={id}
          title={deck.metaData.title}
          description={deck.metaData.desc}
          numCards={deck.cards.length}
          onClick={() => navigateToResult(category, id)}
          author={author}
        />
      );
    });
    return <div className="search-page-deck-tiles">{deckTiles}</div>;
  }
};
