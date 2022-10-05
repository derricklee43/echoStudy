import React from 'react';
import { ReactComponent as FlashcardDownArrow } from '@/assets/svg/flashcard-down-arrow.svg';
import './flashcard-arrow-icon.scss';

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
