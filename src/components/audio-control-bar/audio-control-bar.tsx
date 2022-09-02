import './audio-control-bar.scss';
import React from 'react';
import { Button } from '../button/button';
import { PauseIcon } from '../../assets/icons/pause-icon/pause-icon';
import { PlayIcon } from '../../assets/icons/play-icon/play-icon';
import { NextIcon } from '../../assets/icons/next-icon/next-icon';
import { PreviousIcon } from '../../assets/icons/previous-icon/previous-icon';

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
  return (
    <div className="c-audio-control-bar">
      <Button className="c-audio-control-button" onClick={onPreviousClick} variant="invisible">
        <PreviousIcon />
      </Button>
      <Button
        className="c-audio-control-button c-audio-play-button"
        onClick={isPaused ? onPlayClick : onPauseClick}
        variant="invisible"
      >
        {isPaused ? <PlayIcon /> : <PauseIcon />}
      </Button>
      <Button className="c-audio-control-button" onClick={onNextClick} variant="invisible">
        <NextIcon />
      </Button>
    </div>
  );
};
