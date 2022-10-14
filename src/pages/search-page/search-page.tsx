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
    searchCategory,
    searchResults,
    searchCategories,
    setSearchCategory,
    setSearchValue,
  } = useSearchCategories();

  return (
    <div>
      <PageHeader label="search" goBackLabel="go back" onGoBackClick={noop} />
      <CategorySearchBar
        searchCategories={searchCategories}
        selectedCategory={searchCategory}
        onSelectedCategoryChange={setSearchCategory}
        searchResults={searchResults}
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
      />
      <SearchBar
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        searchResults={searchResults}
      />
    </div>
  );
};
