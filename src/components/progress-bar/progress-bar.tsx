import React from 'react';
import './progress-bar.scss';

interface ProgressBarProps {
  percent: number;
  label: string;
  variant?: 'label-on-top' | 'label-on-right';
}

export const ProgressBar = ({ percent, label, variant = 'label-on-top' }: ProgressBarProps) => {
  return (
    <div className={`c-progress-bar ${variant}`}>
      <label className="c-bar-label">{label}</label>
      <div className="c-outer-bar">
        {percent > 0 && <div className="c-inner-bar" style={{ width: `${percent}%` }}></div>}
      </div>
    </div>
  );
};
