import React, { ChangeEvent, KeyboardEvent, ReactNode, useMemo, useRef, useState } from 'react';
import { CancelIcon } from '@/assets/icons/cancel-icon/cancel-icon';
import { Button } from '@/components/button/button';
import { DropDownOption, DropDownOptions } from '@/components/drop-down-options/drop-down-options';
import { debounce, noop } from '@/helpers/func';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { useEscapePress } from '@/hooks/use-key-press';
import { useOutsideClick } from '@/hooks/use-outside-click';
import './base-search-bar.scss';

export interface SearchBarProps {
  searchValue: string;
  placeholder?: string;
  disabled?: boolean;
  searchResults?: SearchResult<string, string>[];
  debounceMs?: number;
  onEnterPressed?: (value: string) => void;
  onDebouncedChange?: (value: string) => void;
  onSearchValueChange?: (value: string) => void;
}

export interface SearchResult<S, U> extends DropDownOption<S, U> {
  onSelect: () => void;
}

// TODO restrict BaseSearchBarProps to exclude intintalText and dropDownText
export interface BaseSearchBarProps extends SearchBarProps {
  leftChild: ReactNode;
  shouldShowResults: boolean;
  onShouldShowResultsChange: (shouldShow: boolean) => void;
}

export const BaseSearchBar = ({
  leftChild,
  searchValue,
  shouldShowResults,
  placeholder,
  disabled,
  debounceMs = 250,
  searchResults,
  onSearchValueChange,
  onEnterPressed,
  onDebouncedChange,
  onShouldShowResultsChange,
}: BaseSearchBarProps) => {
  const debouncedChange = useMemo(
    () => debounce(onDebouncedChange ?? noop, debounceMs),
    [onDebouncedChange, debounceMs]
  );

  // hide dropdown after clicking outside the search bar wrapper div
  const wrapperDivRef = useRef(null);
  useOutsideClick(wrapperDivRef, () => onShouldShowResultsChange(false));
  useFocusTrap(wrapperDivRef, shouldShowDropDown());
  useEscapePress(() => onShouldShowResultsChange(false), shouldShowDropDown());

  return (
    <div className="c-search-bar-wrapper" ref={wrapperDivRef}>
      <div className="c-search-bar-content">
        {leftChild}
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
      <div>{getSearchResults()}</div>
    </div>
  );

  function shouldShowDropDown() {
    return hasSearchResults() && shouldShowResults;
  }

  function hasSearchResults() {
    if (!searchResults || !searchValue) return false;
    return searchResults.length > 0;
  }

  function getSearchResults() {
    return (
      <DropDownOptions
        show={shouldShowDropDown()}
        options={searchResults}
        ellipsisOverflow={true}
        onOptionSelect={handleDropDownOptionSelect}
      />
    );
  }

  function handleDropDownOptionSelect(option: DropDownOption<string, string>) {
    const searchResult = searchResults?.find(({ id }) => id === option.id);
    if (searchResult === undefined) {
      throw Error('unable to find selected search result');
    }
    searchResult.onSelect();
    const changedValue = option.value ?? searchValue;
    informChange(changedValue);
    onShouldShowResultsChange(false); // hide since clicked
  }

  function hasText() {
    return searchValue && searchValue.length > 0;
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
};
