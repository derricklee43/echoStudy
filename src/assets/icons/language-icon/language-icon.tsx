import React from 'react';
import { ReactComponent as LanguageSvg } from '@/assets/svg/language.svg';
import './language-icon.scss';

interface LanguageIconProps {
  className?: string;
  variant: 'light' | 'dark';
}

export const LanguageIcon = ({ className = '', variant }: LanguageIconProps) => {
  return <LanguageSvg className={`language-icon ${variant} ${className}`} />;
};
