import React, { ChangeEvent, useState } from 'react';
import { isDefined, isString } from '@/helpers/validator';
import './text-box.scss';

export interface TextBoxProps<T extends string | number = string> {
  value?: T | '';
  inputType?: string; // (e.g. 'text', 'password')
  label?: React.ReactNode;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  variant?: 'light' | 'dark' | 'dark-white';
  className?: string;
  onChange?: (value: string) => void;
}

export const TextBox = <T extends string | number = string>({
  value,
  inputType = 'text',
  label,
  placeholder,
  autoComplete = 'off',
  disabled,
  variant = 'light',
  className,
  onChange,
}: TextBoxProps<T>) => {
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
        autoComplete={autoComplete}
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
    // generic could be a number but value is '' to show no value
    const notBlank = isDefined(value) && value !== '';
    const hasText = notBlank || (isString(value) && value.length > 0);
    return isFocused || hasText;
  }

  function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
    onChange?.(e.target.value);
  }
};
