import React from 'react';
import { ReactComponent as DownArrow } from '@/assets/svg/down-arrow.svg';
import './arrow-icon.scss';

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
