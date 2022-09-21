import React, { ChangeEvent, useState } from 'react';
import { ReactComponent as LockIcon } from '../../assets/svg/security-lock.svg';
import './text-area.scss';

export interface TextAreaProps {
  className?: string;
  lines: number;
  value?: string;
  label?: React.ReactNode;
  animateLabelAsLegend?: boolean;
  placeholder?: string;
  readonly?: boolean;
  resizable?: boolean; // default: false
  variant?: 'light' | 'dark';
  onChange?: (value: string) => void;
}

export const TextArea = ({
  className = '',
  lines,
  value = '',
  label,
  animateLabelAsLegend = true,
  placeholder,
  readonly,
  resizable,
  variant = 'light',
  onChange,
}: TextAreaProps) => {
  const [isFocused, setFocused] = useState(false);

  return (
    <div className={`c-text-area-wrapper ${variant} ${className}`}>
      {label && (
        <label className={`c-text-area-label ${shouldShowAsLegend() ? 'as-legend' : ''}`}>
          {label}
        </label>
      )}
      <textarea
        className={`c-text-area ${readonly ? 'readonly' : ''}`}
        rows={lines}
        placeholder={placeholder}
        readOnly={readonly}
        style={{ resize: resizable ? 'both' : 'none' }}
        value={value}
        onChange={onChangeHandler}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {readonly && getReadonlyFooter()}
    </div>
  );

  function shouldShowAsLegend() {
    const hasText = !!value && value.length > 0;
    return animateLabelAsLegend && (isFocused || hasText);
  }

  function getReadonlyFooter() {
    return (
      <div className="c-text-area-footer">
        <LockIcon />
        <label>readonly</label>
      </div>
    );
  }

  function onChangeHandler(e: ChangeEvent<HTMLTextAreaElement>) {
    onChange?.(e.target.value);
  }
};
