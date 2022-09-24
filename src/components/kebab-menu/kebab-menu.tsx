import React, { ReactNode, useRef, useState } from 'react';
import { KebabMenuIcon } from '../../assets/icons/kebab-menu-icon/kebab-menu-icon';
import { noop } from '../../helpers/func';
import { useFocusTrap } from '../../hooks/use-focus-trap';
import { useOutsideClick } from '../../hooks/use-outside-click';
import { Button } from '../button/button';
import { DropDownOption, DropDownOptions } from '../drop-down-options/drop-down-options';
import './kebab-menu.scss';

interface KebabMenuProps<I, V> {
  className?: string;
  variant: 'blue' | 'white' | 'green' | 'red' | 'light-blue';
  options?: DropDownOption<I, V>[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onOptionSelect?: (option: DropDownOption<I, V>) => void;
}

export const KebabMenu = <I extends string, V extends ReactNode>({
  className = '',
  variant,
  options,
  isOpen,
  setIsOpen,
  onOptionSelect,
}: KebabMenuProps<I, V>) => {
  const kebabMenuRef = useRef(null);
  useOutsideClick(kebabMenuRef, () => setIsOpen(false));
  useFocusTrap(kebabMenuRef, isOpen);

  return (
    <div className={`c-kebab-menu $${className}`} ref={kebabMenuRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="invisible"
        className="c-kebab-menu-button"
        bubbleOnClickEvent={false}
        ariaLabel="kebab-menu"
      >
        <KebabMenuIcon variant={variant} />
      </Button>
      <DropDownOptions
        className="c-kebab-menu-options"
        show={isOpen}
        options={options}
        onOptionSelect={(option) => onOptionSelect?.(option)}
        ellipsisOverflow={false}
      />
    </div>
  );
};
