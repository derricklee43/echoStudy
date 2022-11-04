import React from 'react';
import { SpeakerIcon } from '@/assets/icons/speaker-icon/speaker-icon';
import { RangeSlider } from '@/components/range-slider/range-slider';
import './volume-control.scss';

interface VolumeControlProps {
  className?: string;
  volume: number;
  setVolume: (volume: number) => void;
}

export const VolumeControl = ({ className = '', volume, setVolume }: VolumeControlProps) => {
  const mutedClass = volume == 0 ? 'muted' : '';

  return (
    <div className={`c-volume-control ${className}`}>
      <div className={`c-volume-control-speaker-icon ${mutedClass}`}>
        <SpeakerIcon variant="light-blue" />
      </div>
      <RangeSlider className="c-volume-control-slider" value={volume} setValue={setVolume} />
    </div>
  );
};
