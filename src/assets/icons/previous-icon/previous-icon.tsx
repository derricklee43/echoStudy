import React from 'react';
import { ReactComponent as PreviousSvg } from '../../svg/previous.svg';
import './previous-icon.scss';

interface PreviousIconProps {
  className?: string;
}

export const PreviousIcon = ({ className = '' }: PreviousIconProps) => {
  return <PreviousSvg className={`previous-icon ${className}`} />;
};
