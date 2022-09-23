import React from 'react';
import { ReactComponent as CorrectSvg } from '../../svg/correct.svg';
import './correct-icon.scss';

interface CorrectIconProps {
  className?: string;
}

export const CorrectIcon = ({ className = '' }: CorrectIconProps) => {
  return (
    <CorrectSvg
      className={`correct-icon ${className}`}
      aria-label="correct"
      role="graphics-document"
    />
  );
};
