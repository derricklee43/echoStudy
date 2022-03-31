import './flashcard-arrow-icon.scss';
import React from 'react';
import { ReactComponent as FlashcardDownArrow } from '../../svg/flashcard-down-arrow.svg';

interface FlashcardArrowIconProps {
  variant?: 'active' | 'inactive';
  orientation?: 'up' | 'down';
  className?: string;
}

export const FlashcardArrowIcon = ({
  className = '',
  variant = 'inactive',
  orientation = 'down',
}: FlashcardArrowIconProps) => {
  return (
    <FlashcardDownArrow className={`flashcard-arrow-icon ${variant} ${orientation} ${className}`} />
  );
};
