import React, { useState } from 'react';
import { BaseSearchBar, SearchBarProps } from './base-search-bar/base-search-bar';
import { ReactComponent as SearchIcon } from '../../assets/svg/search-icon.svg';
import './search-bar.scss';

export const SearchBar = (searchBarProps: SearchBarProps) => {
  const [shouldShowResults, setShouldShowResults] = useState(false);

  const hasText = searchBarProps.searchValue.length > 0;
  const containerClass = `c-search-icon-container ${hasText ? 'has-text' : ''}`;

  const searchIcon = (
    <div className={containerClass}>
      <SearchIcon className="c-search-icon" />
    </div>
  );

  return (
    <BaseSearchBar
      {...searchBarProps}
      leftChild={searchIcon}
      shouldShowResults={shouldShowResults}
      onShouldShowResultsChange={setShouldShowResults}
    />
  );
};
