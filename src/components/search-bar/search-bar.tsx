import React, { ChangeEvent, KeyboardEvent, useMemo, useRef, useState } from 'react';
import { CancelIcon } from '@/assets/icons/cancel-icon/cancel-icon';
import { ReactComponent as SearchIcon } from '@/assets/svg/search-icon.svg';
import { Button } from '@/components/button/button';
import { DropDownOption, DropDownOptions } from '@/components/drop-down-options/drop-down-options';
import { debounce, noop } from '@/helpers/func';
import { includesIgnoreCase } from '@/helpers/string';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { useEscapePress } from '@/hooks/use-key-press';
import { useOutsideClick } from '@/hooks/use-outside-click';
import { BaseSearchBar, SearchBarProps } from './base-search-bar/base-search-bar';
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
