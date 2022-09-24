import React, { ReactNode, useRef, useState } from 'react';
import { ArrowIcon } from '../../assets/icons/arrow-icon/arrow-icon';
import { useFocusTrap } from '../../hooks/use-focus-trap';
import { useEscapePress } from '../../hooks/use-key-press';
import { useOutsideClick } from '../../hooks/use-outside-click';
import { Button } from '../button/button';
import { DropDownOption, DropDownOptions } from '../drop-down-options/drop-down-options';
import './drop-down.scss';

interface DropDownProps<I, V> {
  variant?: 'dark' | 'light';
  label?: React.ReactNode;
  className?: string;
  options: DropDownOption<I, V>[];
  buttonLabel: React.ReactNode;
  onOptionSelect: (option: DropDownOption<I, V>) => void;
}

export const DropDown = <I extends string, V extends ReactNode>({
  variant = 'dark',
  label = '',
  className = '',
  options,
  buttonLabel,
  onOptionSelect,
}: DropDownProps<I, V>) => {
  const [isOpen, setIsOpen] = useState(false);
  const accentVariant = variant === 'dark' ? 'light' : 'dark';

  const dropDownMenuRef = useRef(null);
  useOutsideClick(dropDownMenuRef, () => setIsOpen(false), isOpen);
  useFocusTrap(dropDownMenuRef, isOpen);
  useEscapePress(() => setIsOpen(false), isOpen);

  return (
    <div className={`drop-down ${className}`}>
      <label className={accentVariant}>{label}</label>
      <div className="drop-down-menu" ref={dropDownMenuRef}>
        {getDropDownButton()}
        <DropDownOptions
          show={isOpen}
          options={options}
          onOptionSelect={handleOptionSelect}
          ellipsisOverflow={false}
        />
      </div>
    </div>
  );

  function getDropDownButton() {
    return (
      <Button variant={variant} onClick={() => setIsOpen(!isOpen)}>
        <label>{buttonLabel}</label>
        <ArrowIcon variant={accentVariant} orientation={isOpen ? 'up' : 'down'} />
      </Button>
    );
  }

  function handleOptionSelect(option: DropDownOption<I, V>) {
    onOptionSelect(option);
    setIsOpen(false);
  }
};
