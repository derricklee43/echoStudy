import React from 'react';
import { noop } from '../../../helpers/func';
import { ReactComponent as MicrophoneIconSvg } from '../../svg/microphone.svg';
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
