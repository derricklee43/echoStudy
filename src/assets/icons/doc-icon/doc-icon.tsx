import React from 'react';
import { ReactComponent as DocSvg } from '@/assets/svg/doc.svg';
import './doc-icon.scss';

interface DocIconProps {
  variant?: 'dark' | 'light';
  className?: string;
}

export const DocIcon = ({ variant = 'light', className = '' }: DocIconProps) => {
  return <DocSvg className={`doc-icon ${variant} ${className}`} />;
};
