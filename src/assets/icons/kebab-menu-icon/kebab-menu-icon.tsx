import './kabab-menu-icon.scss';
import React from 'react';
import { ReactComponent as KebabMenuSvg } from '../../svg/kebab-menu.svg';

interface KebabMenuIconProps {
  className?: string;
}

export const KebabMenuIcon = ({ className = '' }: KebabMenuIconProps) => {
  return <KebabMenuSvg className={`kebab-icon ${className}`} />;
};
