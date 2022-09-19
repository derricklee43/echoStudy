import React from 'react';
import { ReactComponent as CardStackSvg } from '../../svg/card-stack.svg';
import './card-stack-icon.scss';

interface CardStackIconProps {
  className?: string;
}

export const CardStackIcon = ({ className = '' }: CardStackIconProps) => {
  return <CardStackSvg className={`card-stack-icon ${className}`} />;
};
