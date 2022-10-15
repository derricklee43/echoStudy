import React from 'react';
import { PageHeader } from '@/components/page-header/page-header';
import { CategorySearchBar } from '@/components/search-bar/category-search-bar/category-search-bar';
import { SearchBar } from '@/components/search-bar/search-bar';
import { noop } from '@/helpers/func';
import { useSearchCategories } from '@/hooks/use-search-categories';
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

  const placeholder = `search ${searchCategory.id}...`;
  return (
    <div>
      <PageHeader label="search" />
      <CategorySearchBar
        searchValue={searchValue}
        selectedCategory={searchCategory}
        searchCategories={searchCategories}
        searchResults={searchResults}
        placeholder={placeholder}
        areResultsLoading={isLoading}
        onSearchValueChange={setSearchValue}
        onCategorySelect={setSearchCategory}
        onSearchResultSelect={navigateToResult}
      />
      <SearchBar
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        searchResults={searchResults}
        areResultsLoading={isLoading}
      />
    </div>
  );
};
