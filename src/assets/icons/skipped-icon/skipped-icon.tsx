import React from 'react';
import { ReactComponent as SkippedSvg } from '../../svg/skipped.svg';
import './skipped-icon.scss';

interface SkippedIconProps {
  className?: string;
}

export const SkippedIcon = ({ className = '' }: SkippedIconProps) => {
  return (
    <SkippedSvg
      className={`skipped-icon ${className}`}
      aria-label="skipped"
      role="graphics-document"
    />
  );
};
