import './back-arrow-icon.scss';
import React from 'react';
import { ReactComponent as BackArrowSvg } from '../../svg/back-arrow.svg';

interface BackArrowIconProps {
  className?: string;
}

export const BackArrowIcon = ({ className = '' }: BackArrowIconProps) => {
  return <BackArrowSvg className={`back-arrow-icon ${className}`} />;
};
