import React from 'react';
import { ReactComponent as PauseSvg } from '@/assets/svg/pause.svg';
import './pause-icon.scss';

interface PauseIconProps {
  className?: string;
}

export const PauseIcon = ({ className = '' }: PauseIconProps) => {
  return <PauseSvg className={`pause-icon ${className}`} />;
};
