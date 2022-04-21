import './radio-button-group.scss';
import React from 'react';
import { Button } from '../../components/button/button';

export type RadioButtonOptions = Record<string, React.ReactNode>;

interface ImportCardsPopupProps {
  className?: string;
  radioButtonOptions: RadioButtonOptions;
  selectedButtonKey: string;
  onButtonSelect: (radioButtonKey: string) => void;
}

export const RadioButtonGroup = ({
  className = '',
  radioButtonOptions,
  selectedButtonKey,
  onButtonSelect,
}: ImportCardsPopupProps) => {
  return (
    <div className={`radio-button-group ${className}`}>
      {Object.entries(radioButtonOptions).map(([key, buttonContent]) => (
        <Button
          key={key}
          className="button-group-radio-button"
          variant={key === selectedButtonKey ? 'dark' : 'light'}
          onClick={() => onButtonSelect(key)}
        >
          {buttonContent}
        </Button>
      ))}
    </div>
  );
};
