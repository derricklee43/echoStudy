import React, { useRef, useState } from 'react';
import { ArrowIcon } from '../../assets/icons/arrow-icon/arrow-icon';
import { useFocusTrap } from '../../hooks/use-focus-trap';
import { useOutsideClick } from '../../hooks/use-outside-click';
import { Button } from '../button/button';
import { DropDownOption, DropDownOptions } from '../drop-down-options/drop-down-options';
import './drop-down.scss';

interface DropDownProps<T> {
  variant?: 'dark' | 'light';
  label?: React.ReactNode;
  className?: string;
  options: DropDownOption<T>[];
  buttonLabel: React.ReactNode;
  onOptionSelect: (option: DropDownOption<T>) => void;
}

export const DropDown = <T extends React.ReactNode>({
  variant = 'dark',
  label = '',
  className = '',
  options,
  buttonLabel,
  onOptionSelect,
}: DropDownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const accentVariant = variant === 'dark' ? 'light' : 'dark';

  const dropDownMenuRef = useRef(null);
  useOutsideClick(dropDownMenuRef, () => setIsOpen(false));
  useFocusTrap(dropDownMenuRef, isOpen);

  return (
    <div className="drop-down">
      <label className={accentVariant}>{label}</label>
      <div className={`drop-down-menu ${className}`} ref={dropDownMenuRef}>
        {getDropDownButton()}
        <DropDownOptions show={isOpen} options={options} onOptionSelect={handleOptionSelect} />
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

  function handleOptionSelect(option: DropDownOption<T>) {
    onOptionSelect(option);
    setIsOpen(false);
  }
};
