import React from 'react';
import { ReactComponent as Trash } from '@/assets/svg/trash.svg';
import './trash-icon.scss';

interface TrashIconProps {
  variant?: 'active' | 'inactive' | 'dark';
  className?: string;
}

export const TrashIcon = ({ variant = 'inactive', className = '' }: TrashIconProps) => {
  return <Trash className={`trash-icon ${variant} ${className}`} />;
};
