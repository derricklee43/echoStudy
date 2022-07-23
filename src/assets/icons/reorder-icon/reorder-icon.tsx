import './reorder-icon.scss';
import React from 'react';
import { ReactComponent as ReorderSvg } from '../../svg/reorder.svg';

interface ReorderIconProps {
  variant?: 'active' | 'inactive';
  orientation?: 'up' | 'down';
  className?: string;
}

export const ReorderIcon = ({
  className = '',
  variant = 'inactive',
  orientation = 'down',
}: ReorderIconProps) => {
  return <ReorderSvg className={`reorder-icon ${variant} ${orientation} ${className}`} />;
};
