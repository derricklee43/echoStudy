import React from 'react';
import { ReactComponent as BackArrowSvg } from '@/assets/svg/back-arrow.svg';
import './back-arrow-icon.scss';

interface BackArrowIconProps {
  className?: string;
}

export const BackArrowIcon = ({ className = '' }: BackArrowIconProps) => {
  return <BackArrowSvg className={`back-arrow-icon ${className}`} />;
};
