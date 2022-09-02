import './speaker-icon.scss';
import React from 'react';
import { ReactComponent as SpeakerSvg } from '../../svg/speaker.svg';

interface SpeakerIconProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export const SpeakerIcon = ({ className = '', variant = 'dark' }: SpeakerIconProps) => {
  return <SpeakerSvg className={`speaker-icon ${variant} ${className}`} />;
};
