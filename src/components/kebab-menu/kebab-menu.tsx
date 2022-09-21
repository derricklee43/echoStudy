import React, { useRef, useState } from 'react';
import { KebabMenuIcon } from '../../assets/icons/kebab-menu-icon/kebab-menu-icon';
import { noop } from '../../helpers/func';
import { useFocusTrap } from '../../hooks/use-focus-trap';
import { useOutsideClick } from '../../hooks/use-outside-click';
import { Button } from '../button/button';
import { DropDownOption, DropDownOptions } from '../drop-down-options/drop-down-options';
import './kebab-menu.scss';

interface KebabMenuProps<T> {
  className?: string;
  options?: DropDownOption<T>[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const KebabMenu = <T extends React.ReactNode>({
  className = '',
  options,
  isOpen,
  setIsOpen,
}: KebabMenuProps<T>) => {
  const kebabMenuRef = useRef(null);
  useOutsideClick(kebabMenuRef, () => setIsOpen(false));
  useFocusTrap(kebabMenuRef, isOpen);

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
        onOptionSelect={noop}
        ellipsisOverflow={false}
      />
    </div>
  );
};
