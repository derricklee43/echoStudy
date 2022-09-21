import React from 'react';
import { SpeakerIcon } from '../../assets/icons/speaker-icon/speaker-icon';
import { clamp } from '../../helpers/func';
import './volume-control.scss';

interface VolumeControlProps {
  volume: number;
  setVolume: (volume: number) => void;
}

export const VolumeControl = ({ volume, setVolume }: VolumeControlProps) => {
  // This is a hack to get the input range to have different colors before and after the thumb
  const getBackgroundSize = () => {
    return { backgroundSize: `${volume}% 100%` };
  };

  return (
    <div className="c-volume-control">
      <div className="c-volume-control-speaker-icon">
        <SpeakerIcon variant="white" />
      </div>
      <div>
        <input
          className="c-volume-control-input"
          type="range"
          min="1"
          max="100"
          value={clamp(volume, 0, 100)}
          style={getBackgroundSize()}
          onChange={(event) => setVolume(parseInt(event.target.value))}
        />
      </div>
    </div>
  );
};
