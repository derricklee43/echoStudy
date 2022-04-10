import './drop-down-options.scss';
import React from 'react';
import { Button } from '../button/button';
import { Fade } from '../../animations/fade';
import { AnimatePresence } from 'framer-motion';

export interface DropDownOption {
  id: string;
  value: React.ReactNode;
}

interface DropDownOptionsProps {
  className?: string;
  show: boolean;
  options?: DropDownOption[];
  onOptionSelect: (option: DropDownOption) => void;
}

export const DropDownOptions = ({
  className = '',
  show,
  options,
  onOptionSelect,
}: DropDownOptionsProps) => {
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
