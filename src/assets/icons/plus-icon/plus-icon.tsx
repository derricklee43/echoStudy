import React from 'react';
import { ReactComponent as PlusSvg } from '@/assets/svg/plus.svg';
import './plus-icon.scss';

interface PlusIconProps {
  className?: string;
}

export const PlusIcon = ({ className = '' }: PlusIconProps) => {
  return <PlusSvg className={`plus-icon ${className}`} />;
};
