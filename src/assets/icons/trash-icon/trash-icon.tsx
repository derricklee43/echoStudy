import './trash-icon.scss';
import React from 'react';
import { ReactComponent as Trash } from '../../svg/trash.svg';

interface TrashIconProps {
  variant?: 'active' | 'inactive';
  className?: string;
}

export const TrashIcon = ({ variant = 'inactive', className = '' }: TrashIconProps) => {
  return <Trash className={`trash-icon ${variant} ${className}`} />;
};
