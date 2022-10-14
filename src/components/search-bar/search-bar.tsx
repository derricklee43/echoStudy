import React, { useState } from 'react';
import { ReactComponent as SearchIcon } from '@/assets/svg/search-icon.svg';
import { PartialSearchBar, SearchBarProps } from './partial-search-bar/partial-search-bar';
import './search-bar.scss';

export const SearchBar = (searchBarProps: SearchBarProps) => {
  const [shouldShowResults, setShouldShowResults] = useState(false);

  const hasText = searchBarProps.searchValue && searchBarProps.searchValue.length > 0;
  const containerClass = `c-search-icon-container ${hasText ? 'has-text' : ''}`;

  const searchIcon = (
    <div className={containerClass}>
      <SearchIcon className="c-search-icon" />
    </div>
  );

  return (
    <PartialSearchBar
      {...searchBarProps}
      leftChild={searchIcon}
      shouldShowResults={shouldShowResults}
      onShouldShowResultsChange={setShouldShowResults}
    />
  );
};
