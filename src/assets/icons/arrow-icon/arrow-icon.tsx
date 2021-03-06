import './arrow-icon.scss';
import React from 'react';
import { ReactComponent as DownArrow } from '../../svg/down-arrow.svg';

interface ArrowProps {
  variant?: 'dark' | 'light';
  orientation?: 'up' | 'down';
  className?: string;
}

export const ArrowIcon = ({
  className = '',
  variant = 'dark',
  orientation = 'down',
}: ArrowProps) => {
  return <DownArrow className={`arrow-icon ${variant} ${orientation} ${className}`} />;
};
