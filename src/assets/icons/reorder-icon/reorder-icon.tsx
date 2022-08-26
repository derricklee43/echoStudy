import './reorder-icon.scss';
import React from 'react';
import { ReactComponent as ReorderSvg } from '../../svg/reorder.svg';

interface ReorderIconProps {
  variant?: 'active' | 'inactive';
  className?: string;
}

export const ReorderIcon = ({ className = '', variant = 'inactive' }: ReorderIconProps) => {
  return <ReorderSvg className={`reorder-icon ${variant} ${className}`} />;
};