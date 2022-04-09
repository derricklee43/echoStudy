import './plus-icon.scss';
import React from 'react';
import { ReactComponent as PlusSvg } from '../../svg/plus.svg';

interface PlusIconProps {
  className?: string;
}

export const PlusIcon = ({ className = '' }: PlusIconProps) => {
  return <PlusSvg className={`plus-icon ${className}`} />;
};
