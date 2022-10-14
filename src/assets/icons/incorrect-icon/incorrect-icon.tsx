import React from 'react';
import { ReactComponent as IncorrectSvg } from '@/assets/svg/incorrect.svg';
import './incorrect-icon.scss';

interface IncorrectIconProps {
  className?: string;
}

export const IncorrectIcon = ({ className = '' }: IncorrectIconProps) => {
  return (
    <IncorrectSvg
      className={`incorrect-icon ${className}`}
      aria-label="incorrect"
      role="graphics-document"
    />
  );
};
