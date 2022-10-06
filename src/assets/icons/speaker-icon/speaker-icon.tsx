import React from 'react';
import { ReactComponent as SpeakerSvg } from '@/assets/svg/speaker.svg';
import './speaker-icon.scss';

interface SpeakerIconProps {
  className?: string;
  variant?: 'white' | 'light-blue' | 'green' | 'red';
}

export const SpeakerIcon = ({ className = '', variant = 'light-blue' }: SpeakerIconProps) => {
  return <SpeakerSvg className={`speaker-icon ${variant} ${className}`} />;
};
