import React, { useState } from 'react';
import { EllipsisMenuIcon } from '@/assets/icons/ellipsis-menu-icon/ellipsis-menu-icon';
import { NextIcon } from '@/assets/icons/next-icon/next-icon';
import { PauseIcon } from '@/assets/icons/pause-icon/pause-icon';
import { PlayIcon } from '@/assets/icons/play-icon/play-icon';
import { PreviousIcon } from '@/assets/icons/previous-icon/previous-icon';
import { Button } from '@/components/button/button';
import { VolumeControl } from '@/components/volume-control/volume-control';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { LocalStorageKeys } from '@/state/init';
import './audio-control-bar.scss';

interface AudioControlBarProps {
  isPaused: boolean;
  onPlayClick: () => void;
  onPauseClick: () => void;
  onNextClick: () => void;
  onPreviousClick: () => void;
}

export const AudioControlBar = ({
  isPaused,
  onPlayClick,
  onNextClick,
  onPauseClick,
  onPreviousClick,
}: AudioControlBarProps) => {
  const storage = useLocalStorage();
  const [volume, setVolume] = useState(Math.round(Howler.volume() * 100));

  return (
    <div className="c-audio-control-bar">
      <EllipsisMenuIcon className="player-settings-icon" variant="light-blue" />
      <div className="player-controls">
        <Button
          className="c-audio-control-button"
          onClick={onPreviousClick}
          variant="invisible"
          ariaLabel="previous"
        >
          <PreviousIcon />
        </Button>
        <Button
          className="c-audio-control-button c-audio-play-button"
          onClick={isPaused ? onPlayClick : onPauseClick}
          variant="invisible"
          ariaLabel={isPaused ? 'play' : 'pause'}
        >
          {isPaused ? <PlayIcon /> : <PauseIcon />}
        </Button>
        <Button
          className="c-audio-control-button"
          onClick={onNextClick}
          variant="invisible"
          ariaLabel="next"
        >
          <NextIcon />
        </Button>
      </div>
      <VolumeControl className="player-volume" volume={volume} setVolume={handleVolumeChange} />
    </div>
  );

  function handleVolumeChange(newVolume: number) {
    setVolume(newVolume); // [0, 100]
    storage.upsert(LocalStorageKeys.volumeLevelPercent, `${newVolume}`);

    Howler.volume(newVolume / 100); // [0.0, 1.0]
  }
};
