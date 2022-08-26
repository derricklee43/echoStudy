import './language-icon.scss';
import React from 'react';
import { ReactComponent as LanguageSvg } from '../../svg/language.svg';

interface LanguageIconProps {
  className?: string;
  variant: 'light' | 'dark';
}

export const LanguageIcon = ({ className = '', variant }: LanguageIconProps) => {
  return <LanguageSvg className={`language-icon ${variant} ${className}`} />;
};
