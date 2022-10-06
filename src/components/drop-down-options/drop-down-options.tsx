import React, { ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Fade } from '@/animations/fade';
import { Button } from '@/components/button/button';
import './drop-down-options.scss';

/**
 *
 */
export interface DropDownOption<I, V> {
  id: I;
  value: V;
  focusable: boolean;
}

interface DropDownOptionsProps<I, V> {
  className?: string;
  ellipsisOverflow: boolean;
  show: boolean;
  options?: DropDownOption<I, V>[];
  onOptionSelect: (option: DropDownOption<I, V>) => void;
}

/**
 *  if subscriber sets ellipsisOver to false, it is the consumer's responsibility
 *  to guard against overflows.
 *
 *  When enabled, a nested DropDownOptions component will not work due to
 *  this restriction: https://stackoverflow.com/a/6433475/14356299
 */
export const DropDownOptions = <I extends string, V extends ReactNode>({
  className = '',
  ellipsisOverflow = true,
  show,
  options,
  onOptionSelect,
}: DropDownOptionsProps<I, V>) => {
  return (
    <AnimatePresence>
      {show && options !== undefined && (
        <Fade fadeIn={false} className={`c-drop-down-options ${className}`}>
          {options.map(getOption)}
        </Fade>
      )}
    </AnimatePresence>
  );

  function getOption(option: DropDownOption<I, V>) {
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
