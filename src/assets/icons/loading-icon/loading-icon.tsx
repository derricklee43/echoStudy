import React from 'react';
import { Fade } from '../../../animations/fade';
import './loading-icon.scss';

interface LoadingIconProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  fadeIn?: boolean;
}

export const LoadingIcon = ({
  className = '',
  size = 'small',
  fadeIn = true,
}: LoadingIconProps) => {
  return (
    <Fade fadeIn={fadeIn}>
      <div className={`c-loading-icon ${size} ${className}`}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </Fade>
  );
};
