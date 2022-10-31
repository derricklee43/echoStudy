import React from 'react';
import { SpeakerIcon } from '@/assets/icons/speaker-icon/speaker-icon';
import { clamp } from '@/helpers/func';
import './volume-control.scss';

interface VolumeControlProps {
  className?: string;
  volume: number;
  setVolume: (volume: number) => void;
}

export const VolumeControl = ({ className = '', volume, setVolume }: VolumeControlProps) => {
  // This is a hack to get the input range to have different colors before and after the thumb
  const getBackgroundSize = () => {
    return { backgroundSize: `${volume}% 100%` };
  };

  const mutedClass = volume == 0 ? 'muted' : '';

  return (
    <div className={`c-volume-control ${className}`}>
      <div className={`c-volume-control-speaker-icon ${mutedClass}`}>
        <SpeakerIcon variant="light-blue" />
      </div>
      <div>
        <input
          className="c-volume-control-input"
          type="range"
          min="0"
          max="100"
          value={clamp(volume, 0, 100)}
          style={getBackgroundSize()}
          onChange={(event) => setVolume(parseInt(event.target.value))}
        />
      </div>
    </div>
  );
};
