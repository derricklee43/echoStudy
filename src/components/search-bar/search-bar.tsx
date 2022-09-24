import React, { ChangeEvent, KeyboardEvent, useMemo, useRef, useState } from 'react';
import { CancelIcon } from '../../assets/icons/cancel-icon/cancel-icon';
import { ReactComponent as SearchIcon } from '../../assets/svg/search-icon.svg';
import { debounce, noop } from '../../helpers/func';
import { includesIgnoreCase } from '../../helpers/string';
import { useFocusTrap } from '../../hooks/use-focus-trap';
import { useEscapePress } from '../../hooks/use-key-press';
import { useOutsideClick } from '../../hooks/use-outside-click';
import { Button } from '../button/button';
import { DropDownOption, DropDownOptions } from '../drop-down-options/drop-down-options';
import './search-bar.scss';

export interface SearchBarProps {
  initialText?: string;
  placeholder?: string;
  disabled?: boolean;
  dropDownData?: DropDownOption<string>[];
  dropDownIgnoreCase?: boolean;
  debounceMs?: number;
  onChange?: (value: string) => void;
  onEnterPressed?: (value: string) => void;
  onDebouncedChange?: (value: string) => void;
  onDropdownClick?: (option: DropDownOption<string>) => void;
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
  useOutsideClick(wrapperDivRef, () => setHasClickedSinceLastChange(true), shouldShowDropDown());
  useFocusTrap(wrapperDivRef, shouldShowDropDown());
  useEscapePress(() => setHasClickedSinceLastChange(true), shouldShowDropDown());

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
        <Button
          onClick={() => setValue('')}
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
    return hasSearchResults() && !hasClickedSinceLastChange;
  }

  function hasSearchResults() {
    if (!dropDownData || !value) return false;
    return dropDownData.some(optionIncludesValueFilter);
  }

  function getSearchResults() {
    return (
      <DropDownOptions
        show={shouldShowDropDown()}
        options={dropDownData?.filter(optionIncludesValueFilter)}
        ellipsisOverflow={true}
        onOptionSelect={(option) => {
          const changedValue = option.value?.toString() ?? value;
          setValue(changedValue);
          informChange(changedValue);
          onDropdownClick?.(option);
          setHasClickedSinceLastChange(true); // hide since clicked
        }}
      />
    );
  }

  function optionIncludesValueFilter(option: DropDownOption<string>) {
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
