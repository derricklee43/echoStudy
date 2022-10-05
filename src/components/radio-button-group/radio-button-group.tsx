import React, { ReactNode } from 'react';
import { Button } from '@/components/button/button';
import './radio-button-group.scss';

export type RadioButtonOption<I extends string, V extends ReactNode> = { id: I; value: V };

interface ImportCardsPopupProps<I extends string, V> {
  variant: 'dark' | 'light';
  className?: string;
  radioButtonOptions: RadioButtonOption<I, V>[];
  selectedButtonId: I;
  onButtonSelect: (radioButtonId: I) => void;
}

export const RadioButtonGroup = <I extends string, V>({
  variant,
  className = '',
  radioButtonOptions,
  selectedButtonId,
  onButtonSelect,
}: ImportCardsPopupProps<I, V>) => {
  return (
    <div className={`radio-button-group ${variant} ${className}`}>
      {radioButtonOptions.map(getButton)}
    </div>
  );

  function getButton(option: RadioButtonOption<I, V>) {
    const isSelected = option.id === selectedButtonId;
    const className = isSelected ? 'selected' : 'unselected';
    const buttonVariant = variant === 'dark' || isSelected ? 'dark' : 'light';
    return (
      <Button
        key={option.id}
        className={`button-group-radio-button ${className}`}
        variant={buttonVariant}
        onClick={() => onButtonSelect(option.id)}
      >
        {option.value}
      </Button>
    );
  }
};
