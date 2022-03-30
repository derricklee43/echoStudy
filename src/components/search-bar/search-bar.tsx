import React, { useState, KeyboardEvent, ChangeEvent, useMemo, useRef } from 'react';
import { ReactComponent as CancelIcon } from '../../assets/svg/cancel-icon.svg';
import { ReactComponent as SearchIcon } from '../../assets/svg/search-icon.svg';
import { debounce, noop } from '../../helpers/func';
import { includesIgnoreCase } from '../../helpers/string';
import { useOutsideClick } from '../../hooks/use-outside-click';
import { DropDownOption } from '../drop-down/drop-down';
import './search-bar.scss';

export interface SearchBarProps {
  initialText?: string;
  placeholder?: string;
  disabled?: boolean;
  dropDownData?: DropDownOption[];
  dropDownIgnoreCase?: boolean;
  debounceMs?: number;
  onChange?: (value: string) => void;
  onEnterPressed?: (value: string) => void;
  onDebouncedChange?: (value: string) => void;
  onDropdownClick?: (option: DropDownOption) => void;
}

export const SearchBar = ({
  initialText = '',
  placeholder,
  disabled,
  dropDownData,
  dropDownIgnoreCase = true,
  debounceMs = 250,
  onChange,
  onEnterPressed,
  onDebouncedChange,
  onDropdownClick,
}: SearchBarProps) => {
  const [value, setValue] = useState(initialText);
  const [hasClickedSinceLastChange, setHasClickedSinceLastChange] = useState(false);

  const debouncedChange = useMemo(
    () => debounce(onDebouncedChange ?? noop, debounceMs),
    [onDebouncedChange, debounceMs]
  );

  // hide dropdown after clicking outside the search bar wrapper div
  const wrapperDivRef = useRef(null);
  useOutsideClick(wrapperDivRef, () => setHasClickedSinceLastChange(true));

  return (
    <div className="c-search-bar-wrapper" ref={wrapperDivRef}>
      <div className="c-search-bar-content">
        <div className={`c-search-icon-container ${hasText() ? 'has-text' : ''}`}>
          <SearchIcon className="c-search-icon" />
        </div>
        <input
          className="c-search-bar-input"
          placeholder={placeholder}
          value={value}
          type="text"
          onFocus={() => setHasClickedSinceLastChange(false)}
          onChange={onChangeHandler}
          onKeyPress={onEnterPressHandler}
          disabled={disabled}
        />
        <div className={`c-cancel-icon-container ${hasText() ? 'has-text' : ''}`}>
          <CancelIcon className="c-cancel-icon" onClick={() => setValue('')} />
        </div>
      </div>
      <div className={`c-drop-down ${shouldShowDropDown() ? '' : 'hidden'}`}>
        {getSearchResults()}
      </div>
    </div>
  );

  function shouldShowDropDown() {
    return hasSearchResults() && !hasClickedSinceLastChange;
  }

  function hasSearchResults() {
    if (!dropDownData || !value) return false;
    return dropDownData.some(optionIncludesValueFilter);
  }

  function getSearchResults() {
    if (!dropDownData || !value) return null;
    return dropDownData.filter(optionIncludesValueFilter).map((option) => (
      <div
        className="c-drop-down-result"
        key={option.id}
        onClick={() => {
          const changedValue = option.value?.toString() ?? value;
          setValue(changedValue);
          informChange(changedValue);
          onDropdownClick?.(option);
          setHasClickedSinceLastChange(true); // hide since clicked
        }}
      >
        {option.value}
      </div>
    ));
  }

  function optionIncludesValueFilter(option: DropDownOption) {
    if (typeof option.value !== 'string') {
      return false;
    }
    const optionVal = option.value;
    const searchVal = value.trim();
    return dropDownIgnoreCase
      ? includesIgnoreCase(optionVal, searchVal)
      : optionVal.includes(searchVal);
  }

  function hasText() {
    return value && value.length > 0;
  }

  function informChange(value: string) {
    onChange?.(value);

    if (onDebouncedChange) {
      debouncedChange(value);
    }
  }

  function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    setHasClickedSinceLastChange(false);
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
