import React, {
  useState,
  KeyboardEvent,
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { ReactComponent as CancelIcon } from '../../assets/svg/cancel-icon.svg';
import { ReactComponent as SearchIcon } from '../../assets/svg/search-icon.svg';
import { debounce, noop } from '../../helpers/func';
import './search-bar.scss';

export interface SearchBarProps {
  initialText?: string;
  placeholder?: string;
  disabled?: boolean;
  debounceMs?: number;
  onChange?: (value: string) => void;
  onEnterPressed?: (value: string) => void;
  onDebouncedChange?: (value: string) => void;
}

export const SearchBar = ({
  initialText = '',
  placeholder,
  disabled,
  debounceMs = 250,
  onChange,
  onEnterPressed,
  onDebouncedChange,
}: SearchBarProps) => {
  const [value, setValue] = useState(initialText);
  const debouncedChange = useMemo(
    () => debounce(onDebouncedChange ?? noop, debounceMs),
    [onDebouncedChange, debounceMs]
  );

  return (
    <div className="search-bar-wrapper">
      <div className={`search-icon-container ${hasText() ? 'has-text' : ''}`}>
        <SearchIcon className="search-icon" />
      </div>
      <input
        className="search-bar-input"
        placeholder={placeholder}
        value={value}
        type="text"
        onChange={onChangeHandler}
        onKeyPress={onEnterPressHandler}
        disabled={disabled}
      />
      <div className={`cancel-icon-container ${hasText() ? 'has-text' : ''}`}>
        <CancelIcon className="cancel-icon" onClick={() => setValue('')} />
      </div>
    </div>
  );

  function hasText() {
    return value && value.length > 0;
  }

  function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    onChange?.(e.target.value);

    if (onDebouncedChange) {
      debouncedChange(e.target.value);
    }
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
