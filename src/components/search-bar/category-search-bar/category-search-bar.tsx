import React, { ReactNode, useState } from 'react';
import { DropDownOption } from '@/components/drop-down-options/drop-down-options';
import {
  PartialSearchBar,
  SearchBarProps,
} from '@/components/search-bar/partial-search-bar/partial-search-bar';
import { SearchBarCategoryDropdown } from './search-bar-category-dropdown/search-bar-category-dropdown';

export interface CategorySearchBarProps<T, S> extends SearchBarProps {
  searchCategories: DropDownOption<T, S>[];
  selectedCategory: DropDownOption<T, S>;
  onCategorySelect: (category: DropDownOption<T, S>) => void;
}

export const CategorySearchBar = <T extends string, S extends ReactNode>({
  searchCategories,
  selectedCategory,
  onCategorySelect,
  ...baseSearchBarProps
}: CategorySearchBarProps<T, S>) => {
  const [shouldShowResults, setShouldShowResults] = useState(false);

  const categoryDropdown = (
    <SearchBarCategoryDropdown
      selectedCategory={selectedCategory}
      categories={searchCategories}
      onCategorySelect={onCategorySelect}
      onClick={() => setShouldShowResults(false)}
    />
  );

  return (
    <PartialSearchBar
      {...baseSearchBarProps}
      leftChild={categoryDropdown}
      shouldShowResults={shouldShowResults}
      onShouldShowResultsChange={setShouldShowResults}
    />
  );
};
