import React, { ChangeEvent, useState } from 'react';
import { ReactComponent as LockIcon } from '../../assets/svg/security-lock.svg';
import './text-area.scss';

export interface TextAreaProps {
  lines: number;
  value?: string;
  label?: React.ReactNode;
  placeholder?: string;
  readonly?: boolean;
  resizable?: boolean; // default: false
  onChange?: (value: string) => void;
}

export const TextArea = ({
  lines,
  value = '',
  label,
  placeholder,
  readonly,
  resizable,
  onChange,
}: TextAreaProps) => {
  return (
    <div className="c-text-area-wrapper">
      {label && <label className="c-text-area-label">{label}</label>}
      <textarea
        className={`c-text-area ${readonly ? 'readonly' : ''}`}
        rows={lines}
        placeholder={placeholder}
        readOnly={readonly}
        style={{ resize: resizable ? 'both' : 'none' }}
        value={value}
        onChange={onChangeHandler}
      />
      {readonly && getReadonlyFooter()}
    </div>
  );

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
