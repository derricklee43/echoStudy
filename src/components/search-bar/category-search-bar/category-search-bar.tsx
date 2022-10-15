import React, { ReactNode, useState } from 'react';
import { DropDown } from '@/components/drop-down/drop-down';
import { DropDownOption } from '@/components/drop-down-options/drop-down-options';
import {
  PartialSearchBar,
  SearchBarProps,
} from '@/components/search-bar/partial-search-bar/partial-search-bar';
import './category-search-bar.scss';

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
    <DropDown
      buttonLabel={selectedCategory.value}
      options={searchCategories}
      onOptionSelect={onCategorySelect}
      onClick={() => setShouldShowResults(false)}
      buttonClassName="category-dropdown-button"
      ellipsisOverflow={false}
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
