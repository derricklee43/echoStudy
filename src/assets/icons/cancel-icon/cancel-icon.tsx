import React from 'react';
import { noop } from '../../../helpers/func';
import { ReactComponent as CancelIconSvg } from '../../svg/cancel-icon.svg';
import './cancel-icon.scss';

interface CancelIconProps {
  variant?: 'dark' | 'light';
  className?: string;
  onClick?: (event: React.MouseEvent) => void;
}

export const CancelIcon = ({
  variant = 'light',
  className = '',
  onClick = noop,
}: CancelIconProps) => {
  return <CancelIconSvg className={`cancel-icon ${variant} ${className}`} onClick={onClick} />;
};
