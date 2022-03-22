import './progress-bar.scss';
import React from 'react';

interface ProgressBarProps {
  percent: number;
  label: string;
  variant: 'labelOnTop' | 'labelOnRight';
}

export const ProgressBar = ({ percent, label, variant }: ProgressBarProps) => {
  return (
    <div className={`progress-bar ${variant}`}>
      <label className="bar-label">{label}</label>
      <div className="outer-bar">
        {percent > 0 && <div className="inner-bar" style={{ width: `${percent}%` }}></div>}
      </div>
    </div>
  );
};
