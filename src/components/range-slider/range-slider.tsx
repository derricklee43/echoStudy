import React from 'react';
import { clamp } from '@/helpers/func';
import './range-slider.scss';

interface RangeSliderProps {
  className?: string;
  minValue?: number;
  maxValue?: number;
  disabled?: boolean;
  value: number;
  setValue: (newValue: number) => void;
}

export const RangeSlider = ({
  className = '',
  minValue = 0,
  maxValue = 100,
  disabled = false,
  value,
  setValue,
}: RangeSliderProps) => {
  // This is a hack to get the input range to have different colors before and after the thumb
  const percentage = ((value - minValue) / (maxValue - minValue)) * 100;
  const getBackgroundSize = () => {
    return { backgroundSize: `${percentage}% 100%` };
  };

  return (
    <div className={`c-range-slider ${className}`}>
      <input
        className="c-range-slider-input"
        type="range"
        disabled={disabled}
        min={minValue}
        max={maxValue}
        value={clamp(value, minValue, maxValue)}
        style={getBackgroundSize()}
        onChange={(event) => setValue(parseInt(event.target.value))}
      />
    </div>
  );
};
