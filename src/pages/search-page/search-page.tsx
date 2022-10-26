import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DeckCover } from '@/components/deck-cover/deck-cover';
import { DeckTile } from '@/components/deck-tile/deck-tile';
import { LoadingPage } from '@/components/loading-page/loading-page';
import { PageHeader } from '@/components/page-header/page-header';
import { CategorySearchBar } from '@/components/search-bar/category-search-bar/category-search-bar';
import { UserTile } from '@/components/user-tile/user-tile';
import { useSearchCategories } from '@/hooks/use-search-categories';
import { paths } from '@/routing/paths';
import './search-page.scss';

export const SearchPage = () => {
  const navigate = useNavigate();
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
    if (searchCategory.id === 'users') {
      return getUserTiles();
    }
    return searchCategory.id === 'my decks' ? getMyDeckCovers() : getPublicDeckTiles();
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

  function getMyDeckCovers() {
    const decks = categorySearchResults['my decks'];
    if (decks === undefined) {
      return;
    }
    const deckCovers = decks.map((deck) => {
      const deckId = deck.metaData.id;
      return (
        <DeckCover
          key={deckId}
          deck={deck}
          onStudyClick={() => navigate(`${paths.study}/${deckId}`)}
          onViewClick={() => navigate(`${paths.deck}/${deckId}`)}
        />
      );
    });
    return <div className="search-page-deck-covers">{deckCovers}</div>;
  }

  function getPublicDeckTiles() {
    const decks = categorySearchResults['public decks'];
    if (decks === undefined) {
      return;
    }

    const deckTiles = decks.map((deck) => {
      const id = deck.metaData.id.toString();
      const author = `@${deck.metaData.ownerUsername}`;
      return (
        <DeckTile
          key={id}
          title={deck.metaData.title}
          description={deck.metaData.desc}
          numCards={deck.metaData.cardIds.length}
          onClick={() => navigateToResult('public decks', id)}
          author={author}
        />
      );
    });
    return <div className="search-page-public-deck-tiles">{deckTiles}</div>;
  }
};
