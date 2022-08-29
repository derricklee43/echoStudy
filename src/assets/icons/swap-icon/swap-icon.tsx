import React from 'react';
import { ReactComponent as SwapSvg } from '../../svg/swap.svg';
import './swap-icon.scss';

interface SwapIconProps {
  className?: string;
  variant: 'light' | 'dark';
}

export const SwapIcon = ({ className = '', variant }: SwapIconProps) => {
  return <SwapSvg className={`swap-icon ${variant} ${className}`} />;
};
