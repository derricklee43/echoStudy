import React from 'react';
import { ReactComponent as StarSvg } from '@/assets/svg/star.svg';
import './star-icon.scss';

interface StarIconProps {
  className?: string;
}

export const StarIcon = ({ className = '' }: StarIconProps) => {
  return <StarSvg className={`star-icon ${className}`} />;
};
