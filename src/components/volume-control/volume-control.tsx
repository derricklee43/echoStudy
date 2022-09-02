import React from 'react';
import { SpeakerIcon } from '../../assets/icons/speaker-icon/speaker-icon';
import './volume-control.scss';

interface VolumeControlProps {
  volume: string;
  setVolume: (volume: string) => void;
}

export const VolumeControl = ({ volume, setVolume }: VolumeControlProps) => {
  // This is a hack to get the input range to have different colors before and after the thumb
  const getBackgroundSize = () => {
    return { backgroundSize: `${volume}% 100%` };
  };

  return (
    <div className="c-volume-control">
      <div className="c-volume-control-speaker-icon">
        <SpeakerIcon variant="light" />
      </div>
      <div>
        <input
          className="c-volume-control-input"
          type="range"
          min="1"
          max="100"
          value={volume}
          style={getBackgroundSize()}
          onChange={(event) => setVolume(event.target.value)}
        />
      </div>
    </div>
  );
};
