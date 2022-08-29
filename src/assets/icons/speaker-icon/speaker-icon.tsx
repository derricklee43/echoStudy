import React from 'react';
import { ReactComponent as SpeakerSvg } from '../../svg/speaker.svg';
import './speaker-icon.scss';

interface SpeakerIconProps {
  className?: string;
}

export const SpeakerIcon = ({ className = '' }: SpeakerIconProps) => {
  return <SpeakerSvg className={`speaker-icon ${className}`} />;
};
