import React, { ReactNode, useState } from 'react';
import { DropDownOption } from '@/components/drop-down-options/drop-down-options';
import {
  BaseSearchBar,
  SearchBarProps,
} from '@/components/search-bar/base-search-bar/base-search-bar';
import { SearchBarCategoryDropdown } from './category-search-bar-dropdown/category-search-bar-dropdown';
import './category-search-bar.scss';

export interface CategorySearchBarProps<T extends string, S extends ReactNode>
  extends SearchBarProps {
  searchCategories: DropDownOption<T, S>[];
  selectedCategory: DropDownOption<T, S>;
  dropDownIgnoreCase?: boolean;
  onSelectedCategoryChange: (category: DropDownOption<T, S>) => void;
}

export const CategorySearchBar = <T extends string, S extends ReactNode>({
  searchCategories,
  selectedCategory,
  onSelectedCategoryChange,
  ...baseSearchBarProps
}: CategorySearchBarProps<T, S>) => {
  const [shouldShowResults, setShouldShowResults] = useState(false);

  const categoryDropdown = (
    <SearchBarCategoryDropdown
      onClick={() => setShouldShowResults(false)}
      selectedCategory={selectedCategory}
      onCategorySelect={onSelectedCategoryChange}
      categories={searchCategories}
    />
  );

  return (
    <BaseSearchBar
      {...baseSearchBarProps}
      leftChild={categoryDropdown}
      onShouldShowResultsChange={setShouldShowResults}
      shouldShowResults={shouldShowResults}
    />
  );
};
