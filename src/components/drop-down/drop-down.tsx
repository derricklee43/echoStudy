import './drop-down.scss';
import React, { useState } from 'react';
import { Arrow } from '../../assets/icons/arrow/arrow';
import { Button } from '../button/button';

export interface DropDownOption {
  id: string;
  value: React.ReactNode;
}

interface DropDownProps {
  variant?: 'dark' | 'light';
  label?: React.ReactNode;
  className?: string;
  options: DropDownOption[];
  buttonLabel: React.ReactNode;
  onOptionSelect: (option: DropDownOption) => void;
}

export const DropDown = ({
  variant = 'dark',
  label = '',
  className = '',
  options,
  buttonLabel,
  onOptionSelect,
}: DropDownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const accentVariant = variant === 'dark' ? 'light' : 'dark';

  return (
    <div className="drop-down">
      <label className={accentVariant}>{label}</label>
      <div className={`drop-down-menu ${className}`} onBlur={() => setIsOpen(false)}>
        {getDropDownButton()}
        <div className={`options ${isOpen ? '' : 'hidden'}`}>{getOptions()}</div>
      </div>
    </div>
  );

  function getDropDownButton() {
    return (
      <Button variant={variant} onClick={() => setIsOpen(!isOpen)}>
        <label>{buttonLabel}</label>
        <div>
          <Arrow variant={accentVariant} orientation={isOpen ? 'up' : 'down'} />
        </div>
      </Button>
    );
  }

  function getOptions() {
    return options.map((option) => (
      <div className="option" key={option.id} onClick={() => handleOptionSelect(option)}>
        {option.value}
      </div>
    ));
  }

  function handleOptionSelect(option: DropDownOption) {
    onOptionSelect(option);
    setIsOpen(false);
  }
};
