import React from 'react';
import { motion } from 'framer-motion';
import './progress-bar.scss';

interface ProgressBarProps {
  className?: string;
  percent: number;
  label?: string;
  variant: 'dark' | 'light';
}

export const ProgressBar = ({ className = '', percent, label, variant }: ProgressBarProps) => {
  const progress = `${clamp(percent, 0, 100)}%`;
  return (
    <div className={`c-progress-bar ${className}`}>
      {label && <label className="c-bar-label">{label}</label>}
      <div className="c-progress-container">
        <div className={`c-bar-outline ${variant}`}></div>
        {progress !== '0%' && (
          <motion.div
            className={`c-inner-bar ${variant}`}
            initial={{ width: progress }}
            animate={{ width: progress }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />
        )}
      </div>
    </div>
  );
};

function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}
