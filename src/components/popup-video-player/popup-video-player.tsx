import React, { useEffect, useRef, useState } from 'react';
import { CancelIcon } from '@/assets/icons/cancel-icon/cancel-icon';
import { Button } from '@/components/button/button';
import { PopupModal } from '@/components/popup-modal/popup-modal';
import './popup-video-player.scss';

interface PopupVideoPlayerProps {
  title?: string;
  autoPlay?: boolean;
  src: string;
  showTrigger: boolean;
  onClose: () => void;
}

export const PopupVideoPlayer = ({
  title = '',
  autoPlay = false,
  src,
  showTrigger,
  onClose,
}: PopupVideoPlayerProps) => {
  const [isVideoPaused, setIsVideoPaused] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }
    videoRef.current.onpause = () => {
      setIsVideoPaused(true);
    };

    videoRef.current.onplay = () => {
      setIsVideoPaused(false);
    };

    if (autoPlay && showTrigger) {
      videoRef.current.play();
    }
  }, [showTrigger]);

  const headerPausedClass = isVideoPaused ? 'is-paused' : '';

  return (
    <PopupModal
      showTrigger={showTrigger}
      onClose={handleCloseClick}
      showCloseButton={false}
      className="c-pvp-popup-modal"
    >
      <div className="c-pvp-video-container">
        <div className={`c-pvp-hover-header ${headerPausedClass}`}>
          <div className="c-pvp-title">{title}</div>
          <Button className="c-pvp-cancel-button" variant="invisible" onClick={handleCloseClick}>
            <CancelIcon className="c-pvp-cancel-icon" />
          </Button>
        </div>
        <video ref={videoRef} className="c-pvp-video" controls>
          <source src={src} type="video/mp4" />
        </video>
      </div>
    </PopupModal>
  );

  function handleCloseClick() {
    videoRef.current?.pause();
    onClose();
  }
};
