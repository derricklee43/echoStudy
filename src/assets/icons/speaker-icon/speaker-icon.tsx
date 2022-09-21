import React from 'react';
import { ReactComponent as SpeakerSvg } from '../../svg/speaker.svg';
import './speaker-icon.scss';

interface SpeakerIconProps {
  className?: string;
  variant?: 'white' | 'light-blue' | 'green' | 'red';
}

export const SpeakerIcon = ({ className = '', variant = 'light-blue' }: SpeakerIconProps) => {
  return <SpeakerSvg className={`speaker-icon ${variant} ${className}`} />;
};
