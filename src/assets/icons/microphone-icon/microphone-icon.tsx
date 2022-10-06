import React from 'react';
import { ReactComponent as MicrophoneIconSvg } from '@/assets/svg/microphone.svg';
import { noop } from '@/helpers/func';
import './microphone-icon.scss';

interface MicrophoneIconProps {
  variant?: 'dark' | 'light';
  className?: string;
  onClick?: (event: React.MouseEvent) => void;
}

export const MicrophoneIcon = ({
  variant = 'dark',
  className = '',
  onClick = noop,
}: MicrophoneIconProps) => {
  return (
    <MicrophoneIconSvg className={`microphone-icon ${variant} ${className}`} onClick={onClick} />
  );
};
