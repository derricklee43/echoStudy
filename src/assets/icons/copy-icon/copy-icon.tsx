import React from 'react';
import { ReactComponent as CopySvg } from '@/assets/svg/copy.svg';
import './copy-icon.scss';

interface CopyIconProps {
  className?: string;
  onClick?: () => void;
}

export const CopyIcon = ({ className = '', onClick }: CopyIconProps) => {
  return <CopySvg className={`copy-icon ${className}`} onClick={onClick} />;
};
