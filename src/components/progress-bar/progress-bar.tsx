import React from 'react';
import { motion } from 'framer-motion';
import { clamp } from '../../helpers/func';
import './progress-bar.scss';

interface ProgressBarProps {
  className?: string;
  onAnimationComplete?: () => void;
  percent: number;
  label?: string;
  variant: 'gradient' | 'white';
}

export const ProgressBar = ({
  className = '',
  percent,
  label,
  variant,
  onAnimationComplete,
}: ProgressBarProps) => {
  const progress = `${clamp(percent, 0, 100)}%`;
  return (
    <div className={`c-progress-bar ${className}`}>
      {label && <label className="c-bar-label">{label}</label>}
      <div className="c-progress-container">
        <div className={`c-bar-outline ${variant}`}></div>
        <motion.div
          className={`c-inner-bar ${variant}`}
          initial={{ width: progress }}
          animate={{ width: progress }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          onAnimationComplete={onAnimationComplete}
        />
      </div>
    </div>
  );
};
