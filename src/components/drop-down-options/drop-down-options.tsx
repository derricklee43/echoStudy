import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Fade } from '../../animations/fade';
import { Button } from '../button/button';
import './drop-down-options.scss';

/**
 *
 */
export interface DropDownOption<T> {
  id: T;
  value: React.ReactNode;
  focusable: boolean;
}

interface DropDownOptionsProps<T> {
  className?: string;
  ellipsisOverflow: boolean;
  show: boolean;
  options?: DropDownOption<T>[];
  onOptionSelect: (option: DropDownOption<T>) => void;
}

/**
 *  if subscriber sets ellipsisOver to false, it is the consumer's responsibility
 *  to guard against overflows.
 *
 *  When enabled, a nested DropDownOptions component will not work due to
 *  this restriction: https://stackoverflow.com/a/6433475/14356299
 */
export const DropDownOptions = <T extends React.Key>({
  className = '',
  ellipsisOverflow = true,
  show,
  options,
  onOptionSelect,
}: DropDownOptionsProps<T>) => {
  return (
    <AnimatePresence>
      {show && options !== undefined && (
        <Fade fadeIn={false} className={`c-drop-down-options ${className}`}>
          {options.map(getOption)}
        </Fade>
      )}
    </AnimatePresence>
  );

  function getOption(option: DropDownOption<T>) {
    const dropDownOverflow = ellipsisOverflow ? 'ellipsis-overflow' : '';
    const className = `c-drop-down-option ${dropDownOverflow}`;
    if (option.focusable) {
      return (
        <Button
          key={option.id}
          className={className}
          variant="invisible"
          onClick={() => onOptionSelect(option)}
        >
          {option.value}
        </Button>
      );
    }
    return (
      <div key={option.id} className={className}>
        {option.value}
      </div>
    );
  }
};
