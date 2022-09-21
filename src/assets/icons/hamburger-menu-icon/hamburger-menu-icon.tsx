import React from 'react';
import { noop } from '../../../helpers/func';
import { ReactComponent as HamburgerMenuSvg } from '../../svg/hamburger-menu.svg';
import './hamburger-menu-icon.scss';

interface HamburgerMenuIconProps {
  className?: string;
  variant?: 'dark' | 'light';
  orientation?: 'normal' | 'rotated';
  onClick?: (event: React.MouseEvent) => void;
}

export const HamburgerMenuIcon = ({
  className = '',
  variant = 'light',
  orientation = 'normal',
  onClick = noop,
}: HamburgerMenuIconProps) => {
  return (
    <HamburgerMenuSvg
      className={`hamburger-icon ${variant} ${orientation} ${className}`}
      onClick={onClick}
    />
  );
};
