import React from 'react';
import { ReactComponent as KebabMenuSvg } from '../../svg/kebab-menu.svg';
import './kabab-menu-icon.scss';

interface KebabMenuIconProps {
  className?: string;
}

export const KebabMenuIcon = ({ className = '' }: KebabMenuIconProps) => {
  return <KebabMenuSvg className={`kebab-icon ${className}`} />;
};
