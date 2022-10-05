import React from 'react';
import { ReactComponent as NextSvg } from '@/assets/svg/next.svg';
import './next-icon.scss';

interface NextIconProps {
  className?: string;
}

export const NextIcon = ({ className = '' }: NextIconProps) => {
  return <NextSvg className={`next-icon ${className}`} />;
};
