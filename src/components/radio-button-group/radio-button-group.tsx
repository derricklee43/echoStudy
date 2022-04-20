import './radio-button-group.scss';
import React from 'react';
import { Button } from '../../components/button/button';
import { DropDownOption } from '../drop-down-options/drop-down-options';

// Todo: they are the same, maybe generalize??
export type RadioButtonOption = DropDownOption;

interface ImportCardsPopupProps {
  className?: string;
  radioButtonOptions: RadioButtonOption[];
  selectedButton: RadioButtonOption;
  onButtonSelect: (radioButton: RadioButtonOption) => void;
}

export const RadioButtonGroup = ({
  className = '',
  radioButtonOptions,
  selectedButton,
  onButtonSelect,
}: ImportCardsPopupProps) => {
  return (
    <div className={`radio-button-group ${className}`}>
      {radioButtonOptions.map((option) => (
        <Button
          key={option.id}
          className="button-group-radio-button"
          variant={option.id === selectedButton.id ? 'dark' : 'light'}
          onClick={() => onButtonSelect(option)}
        >
          {option.value}
        </Button>
      ))}
    </div>
  );
};
