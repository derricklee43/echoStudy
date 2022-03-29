import React, { useState, KeyboardEvent, ChangeEvent, useRef } from 'react';
import './text-box.scss';

export interface TextBoxProps {
  initialText?: string;
  inputType?: string; // (e.g. 'text', 'password')
  label?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  variant?: 'dark' | 'light';
  className?: string;
  onChange?: (value: string) => void;
}

export const TextBox = ({
  initialText = '',
  inputType = 'text',
  label,
  placeholder,
  disabled,
  variant = 'light',
  className,
  onChange,
}: TextBoxProps) => {
  const [value, setValue] = useState(initialText);
  const [isFocused, setFocused] = useState(false);

  return (
    <div className={`c-text-box-wrapper ${variant} ${className ?? ''}`}>
      {label && (
        <label className={`c-text-box-label ${shouldShowAsLegend() ? 'as-legend' : ''}`}>
          {label}
        </label>
      )}
      <input
        className="c-text-box-input"
        placeholder={placeholder}
        value={value}
        type={inputType}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={onChangeHandler}
        disabled={disabled}
      />
    </div>
  );

  function shouldShowAsLegend() {
    const hasText = !!value && value.length > 0;
    return isFocused || hasText;
  }

  function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    onChange?.(e.target.value);
  }
};
