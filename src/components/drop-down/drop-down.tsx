import React, { ReactNode, useRef, useState } from 'react';
import { ArrowIcon } from '@/assets/icons/arrow-icon/arrow-icon';
import { Button } from '@/components/button/button';
import { DropDownOption, DropDownOptions } from '@/components/drop-down-options/drop-down-options';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { useEscapePress } from '@/hooks/use-key-press';
import { useOutsideClick } from '@/hooks/use-outside-click';
import './drop-down.scss';

interface DropDownProps<I, V> {
  variant?: 'dark' | 'light';
  label?: React.ReactNode;
  className?: string;
  buttonClassName?: string;
  options: DropDownOption<I, V>[];
  buttonLabel: React.ReactNode;
  ellipsisOverflow?: boolean;
  onOptionSelect: (option: DropDownOption<I, V>) => void;
  onClick?: () => void;
}

export const DropDown = <I extends string, V extends ReactNode>({
  variant = 'dark',
  label,
  className = '',
  buttonClassName = '',
  ellipsisOverflow = false,
  options,
  buttonLabel,
  onOptionSelect,
  onClick,
}: DropDownProps<I, V>) => {
  const [isOpen, setIsOpen] = useState(false);
  const accentVariant = variant === 'dark' ? 'light' : 'dark';

  const dropDownMenuRef = useRef(null);
  useOutsideClick(dropDownMenuRef, () => setIsOpen(false), isOpen);
  useFocusTrap(dropDownMenuRef, isOpen);
  useEscapePress(() => setIsOpen(false), isOpen);

  return (
    <div className={`drop-down ${className}`} onClick={onClick}>
      {label !== undefined && <label className={accentVariant}>{label}</label>}
      <div className="drop-down-menu" ref={dropDownMenuRef}>
        <Button
          variant={variant}
          onClick={() => setIsOpen(!isOpen)}
          className={`drop-down-button ${buttonClassName}`}
        >
          {buttonLabel}
          <ArrowIcon variant={accentVariant} orientation={isOpen ? 'up' : 'down'} />
        </Button>
        <DropDownOptions
          show={isOpen}
          options={options}
          onOptionSelect={handleOptionSelect}
          ellipsisOverflow={ellipsisOverflow}
        />
      </div>
    </div>
  );

  function handleOptionSelect(option: DropDownOption<I, V>) {
    onOptionSelect(option);
    setIsOpen(false);
  }
};
