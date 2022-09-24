import React, { useRef, useState } from 'react';
import { KebabMenuIcon } from '../../assets/icons/kebab-menu-icon/kebab-menu-icon';
import { useFocusTrap } from '../../hooks/use-focus-trap';
import { useEscapePress } from '../../hooks/use-key-press';
import { useOutsideClick } from '../../hooks/use-outside-click';
import { Button } from '../button/button';
import { DropDownOption, DropDownOptions } from '../drop-down-options/drop-down-options';
import './kebab-menu.scss';

interface KebabMenuProps<T> {
  className?: string;
  options?: DropDownOption<T>[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onOptionSelect?: (option: DropDownOption<T>) => void;
}

export const KebabMenu = <T extends React.ReactNode>({
  className = '',
  options,
  isOpen,
  setIsOpen,
  onOptionSelect,
}: KebabMenuProps<T>) => {
  const kebabMenuRef = useRef(null);
  useOutsideClick(kebabMenuRef, () => setIsOpen(false), isOpen);
  useFocusTrap(kebabMenuRef, isOpen);
  useEscapePress(() => setIsOpen(false), isOpen);

  return (
    <div className={`c-kebab-menu ${className}`} ref={kebabMenuRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="invisible"
        className="c-kebab-menu-button"
        bubbleOnClickEvent={false}
        ariaLabel="kebab-menu"
      >
        <KebabMenuIcon />
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
