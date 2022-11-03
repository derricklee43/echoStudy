import React, { ChangeEvent, KeyboardEvent, ReactNode, useMemo, useRef } from 'react';
import { CancelIcon } from '@/assets/icons/cancel-icon/cancel-icon';
import { LoadingIcon } from '@/assets/icons/loading-icon/loading-icon';
import { Button } from '@/components/button/button';
import { DropDownOption, DropDownOptions } from '@/components/drop-down-options/drop-down-options';
import { debounce, noop } from '@/helpers/func';
import { isString } from '@/helpers/validator';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { useEscapePress } from '@/hooks/use-key-press';
import { useOutsideClick } from '@/hooks/use-outside-click';
import './partial-search-bar.scss';

export interface SearchBarProps {
  searchValue?: string;
  placeholder?: string;
  disabled?: boolean;
  searchResults?: DropDownOption<string, ReactNode>[];
  debounceMs?: number;
  className?: string;
  areResultsLoading?: boolean;
  onEnterPressed?: (value: string) => void;
  onDebouncedChange?: (value: string) => void;
  onSearchValueChange?: (value: string) => void;
  onSearchResultSelect?: (searchResult: DropDownOption<string, ReactNode>) => void;
}

export interface PartialSearchBarProps extends SearchBarProps {
  leftChild: ReactNode;
  shouldShowResults: boolean;
  onShouldShowResultsChange: (shouldShow: boolean) => void;
}

export const PartialSearchBar = ({
  className = '',
  leftChild,
  searchValue,
  shouldShowResults,
  placeholder,
  disabled,
  debounceMs = 250,
  searchResults,
  areResultsLoading = false,
  onSearchResultSelect,
  onSearchValueChange,
  onEnterPressed,
  onDebouncedChange,
  onShouldShowResultsChange,
}: PartialSearchBarProps) => {
  const debouncedChange = useMemo(
    () => debounce(onDebouncedChange ?? noop, debounceMs),
    [onDebouncedChange, debounceMs]
  );

  // hide dropdown after clicking outside the search bar wrapper div
  const wrapperDivRef = useRef(null);
  useOutsideClick(wrapperDivRef, () => onShouldShowResultsChange(false));
  useFocusTrap(wrapperDivRef, shouldShowSearchResults());
  useEscapePress(() => onShouldShowResultsChange(false), shouldShowSearchResults());

  return (
    <div className={`c-search-bar-wrapper ${className}`} ref={wrapperDivRef}>
      <div className="c-search-bar-content">
        <div className="left-child"> {leftChild}</div>
        <input
          className="c-search-bar-input"
          placeholder={placeholder}
          value={searchValue}
          type="text"
          onFocus={() => onShouldShowResultsChange(true)}
          onChange={onChangeHandler}
          onKeyPress={onEnterPressHandler}
          disabled={disabled}
        />
        <Button
          onClick={() => onSearchValueChange?.('')}
          variant="invisible"
          className={`c-cancel-icon-container ${hasText() ? 'has-text' : ''}`}
        >
          <CancelIcon variant="light" />
        </Button>
      </div>
      <div>
        <DropDownOptions
          show={shouldShowSearchResults()}
          options={getSearchResults()}
          ellipsisOverflow={true}
          onOptionSelect={handleDropDownOptionSelect}
        />
      </div>
    </div>
  );

  function shouldShowSearchResults() {
    return hasText() && shouldShowResults;
  }

  function getSearchResults() {
    if (areResultsLoading) {
      return getLoadingResult();
    }
    if (searchResults === undefined) {
      return [];
    }
    if (searchResults.length === 0) {
      return getNoResultsFoundResult();
    }
    return searchResults;
  }

  function handleDropDownOptionSelect(option: DropDownOption<string, ReactNode>) {
    const searchResult = searchResults?.find(({ id }) => id === option.id);
    if (searchResult === undefined) {
      throw Error('unable to find selected search result');
    }
    onSearchResultSelect?.(searchResult);
    const changedValue = option.value ?? searchValue;
    if (isString(changedValue)) {
      informChange(changedValue);
    }
    onShouldShowResultsChange(false); // hide since clicked
  }

  function hasText() {
    return !!searchValue && searchValue.length > 0;
  }

  function informChange(value: string) {
    onSearchValueChange?.(value);

    if (onDebouncedChange) {
      debouncedChange(value);
    }
  }

  function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
    onShouldShowResultsChange(true);
    informChange(e.target.value);
  }

  function onEnterPressHandler(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const inputElement = e.target as HTMLInputElement;
      onEnterPressed?.(inputElement.value);
      e.preventDefault();
      e.stopPropagation();
    }
  }

  function getLoadingResult(): DropDownOption<string, ReactNode>[] {
    const loading = (
      <div className="loading-result">
        <LoadingIcon className="loading-result-icon" /> loading...
      </div>
    );
    return [{ id: '', value: loading, focusable: false }];
  }

  function getNoResultsFoundResult(): DropDownOption<string, ReactNode>[] {
    const noResults = <div className="no-results">no results found...</div>;
    return [{ id: '', value: noResults, focusable: false }];
  }
};
