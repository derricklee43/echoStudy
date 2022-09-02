import React from 'react';
import { ReactComponent as SpeakerSvg } from '../../svg/speaker.svg';
import './speaker-icon.scss';

interface SpeakerIconProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export const SpeakerIcon = ({ className = '', variant = 'dark' }: SpeakerIconProps) => {
  return <SpeakerSvg className={`speaker-icon ${variant} ${className}`} />;
};
