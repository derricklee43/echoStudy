import React from 'react';
import { ReactComponent as PlaySvg } from '../../svg/play.svg';
import './play-icon.scss';

interface PlayIconProps {
  className?: string;
}

export const PlayIcon = ({ className = '' }: PlayIconProps) => {
  return <PlaySvg className={`play-icon ${className}`} />;
};
