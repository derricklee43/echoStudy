import './bubble-divider.scss';
import React from 'react';
import { useState } from 'react';
import { Button } from '../button/button';
import { ArrowIcon } from '../../assets/icons/arrow-icon/arrow-icon';

interface BubbleDividerProps {
  variant?: 'dark-divider' | 'dark-drop-down'; // Todo: add light variants (and find a better way to have dark and light + dropdown and divider )
  className?: string;
  label: string;
  children?: React.ReactNode;
}

export const BubbleDivider = ({
  variant = 'dark-divider',
  className = '',
  label,
  children,
}: BubbleDividerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`c-bubble-divider-container ${className}`}>
      {isOpen && getChildren()}
      <div className={`c-bubble-divider ${variant}`}>
        <hr />
        <Button className="c-bubble-button" onClick={handleBubbleClick}>
          {label}
          {isDropDown() && getArrow()}
        </Button>
      </div>
    </div>
  );

  function getChildren() {
    return <div className="c-bubble-divider-children">{children}</div>;
  }

  function getArrow() {
    return (
      <div className="c-bubble-divider-arrow">
        <ArrowIcon orientation={isOpen ? 'up' : 'down'} />
      </div>
    );
  }

  function handleBubbleClick() {
    if (isDropDown()) {
      setIsOpen(!isOpen);
    }
  }

  function isDropDown() {
    return variant === 'dark-drop-down';
  }
};
