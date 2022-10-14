import React from 'react';
import { ReactComponent as ClockSvg } from '@/assets/svg/clock.svg';
import './clock-icon.scss';

interface ClockIconProps {
  className?: string;
}

export const ClockIcon = ({ className = '' }: ClockIconProps) => {
  return <ClockSvg className={`clock-icon ${className}`} />;
};
