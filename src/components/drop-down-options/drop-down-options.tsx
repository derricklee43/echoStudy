import './drop-down-options.scss';
import React from 'react';
import { Button } from '../button/button';
import { Fade } from '../../animations/fade';
import { AnimatePresence } from 'framer-motion';

export interface DropDownOption<T> {
  id: string;
  value: T;
}

interface DropDownOptionsProps<T> {
  className?: string;
  show: boolean;
  options?: DropDownOption<T>[];
  onOptionSelect: (option: DropDownOption<T>) => void;
}

export const DropDownOptions = <T extends React.ReactNode>({
  className = '',
  show,
  options,
  onOptionSelect,
}: DropDownOptionsProps<T>) => {
  return (
    <AnimatePresence>
      {show && options !== undefined && (
        <Fade fadeIn={false} className={`c-drop-down-options ${className}`}>
          {options.map((option) => (
            <Button
              className="c-drop-down-option"
              variant="invisible"
              key={option.id}
              onClick={() => onOptionSelect(option)}
            >
              {option.value}
            </Button>
          ))}
        </Fade>
      )}
    </AnimatePresence>
  );
};
