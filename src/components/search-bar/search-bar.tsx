import React, { useCallback, useState } from 'react';
import { ReactComponent as CancelIcon } from '../../assets/svg/cancel-icon.svg';
import { ReactComponent as SearchIcon } from '../../assets/svg/search-icon.svg';
import './search-bar.scss';

export interface SearchBarProps {
  initialText?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  onEnterPressed?: (value: string) => void;
}

export const SearchBar = ({
  initialText,
  placeholder,
  disabled,
  onChange,
  onEnterPressed,
}: SearchBarProps) => {
  const [value, setValue] = useState(initialText);

  const onChangeHandler = useCallback(
    (e) => {
      setValue(e.target.value);
      onChange?.(e.target.value);
    },
    [onChange, setValue]
  );

  const onEnterPressHandler = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        onEnterPressed?.(e.target.value);
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [onEnterPressed]
  );

  function hasText() {
    return value && value.length > 0;
  }

  return (
    <div className="search-bar-wrapper">
      <div className={`search-icon-container ${hasText() ? 'has-text' : ''}`}>
        <SearchIcon className="search-icon" />
      </div>
      <input
        className="search-bar-input"
        placeholder={placeholder ?? ''}
        value={value ?? ''}
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
};
