import React from 'react';
import { ReactComponent as ReorderSvg } from '@/assets/svg/reorder.svg';
import './reorder-icon.scss';

interface ReorderIconProps {
  variant?: 'active' | 'inactive';
  className?: string;
}

export const ReorderIcon = ({ className = '', variant = 'inactive' }: ReorderIconProps) => {
  return <ReorderSvg className={`reorder-icon ${variant} ${className}`} />;
};
