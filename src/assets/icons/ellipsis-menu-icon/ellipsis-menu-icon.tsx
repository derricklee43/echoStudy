import React from 'react';
import { KebabMenuIconProps } from '@/assets/icons/kebab-menu-icon/kebab-menu-icon';
import { ReactComponent as EllipsisMenuSvg } from '@/assets/svg/ellipsis-menu.svg';
import './ellipsis-menu-icon.scss';

export type EllipsisMenuIconProps = KebabMenuIconProps;

export const EllipsisMenuIcon = ({ className = '', variant = 'blue' }: EllipsisMenuIconProps) => {
  return <EllipsisMenuSvg className={`ellipsis-icon ${variant} ${className}`} />;
};
