import './ProgressBar.scss';
import React from 'react';

interface ProgressBarProps {
  percentComplete: number;
}

export const ProgressBar = ({ percentComplete }: ProgressBarProps) => {
  return <div>{percentComplete}</div>;
};
