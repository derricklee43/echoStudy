import React, { useEffect, useState } from 'react';
import { MicrophoneIcon } from '@/assets/icons/microphone-icon/microphone-icon';
import { TrashIcon } from '@/assets/icons/trash-icon/trash-icon';
import { BubbleTagList } from '@/components/bubble-tag-list/bubble-tag-list';
import { Button } from '@/components/button/button';
import { LoadingPage } from '@/components/loading-page/loading-page';
import { PopupModal } from '@/components/popup-modal/popup-modal';
import { useAudioRecorder } from '@/hooks/use-audio-recorder';
import { Card, CardSide } from '@/models/card';
import './record-audio-popup.scss';

export interface RecordAudioCardSide {
  card: Card;
  side: CardSide;
}
interface RecordAudioPopupProps {
  showPopup: boolean;
  recordAudioCardSide: RecordAudioCardSide | undefined;
  onClose: () => void;
  onSave: (audioBlob: Blob | undefined, card: Card, side: CardSide) => void;
}

export const RecordAudioPopup = ({
  showPopup,
  recordAudioCardSide,
  onClose,
  onSave,
}: RecordAudioPopupProps) => {
  const {
    mediaBlob,
    mediaBlobUrl,
    status,
    setMediaBlobUrl,
    clearBlobUrl,
    startRecording,
    stopRecording,
  } = useAudioRecorder({});

  useEffect(() => {
    if (recordAudioCardSide !== undefined) {
      const { card, side } = recordAudioCardSide;
      setMediaBlobUrl(card[side].customAudio?.src);
    }
  }, [recordAudioCardSide, setMediaBlobUrl]);

  if (recordAudioCardSide === undefined) {
    return <LoadingPage />;
  }

  const { card, side } = recordAudioCardSide;
  const cardContent = card[side];

  const clearMedia = () => {
    setMediaBlobUrl(undefined);
    clearBlobUrl();
  };

  const handleCloseClick = () => {
    clearMedia();
    onClose();
  };

  const handleSaveClick = () => {
    if (mediaBlobUrl !== cardContent?.customAudio?.src) {
      onSave(mediaBlob, card, side);
    }
    clearMedia();
  };

  return (
    <PopupModal
      headerLabel="record custom card audio"
      showTrigger={showPopup}
      onClose={handleCloseClick}
    >
      <div className="record-audio-popup">
        <BubbleTagList bubbleTags={[{ value: cardContent.language.toLocaleLowerCase() }]} />
        <div className="record-audio-card-face">{cardContent.text}</div>
        {mediaBlobUrl === undefined ? getAudioRecorder() : getAudioPlayer()}
        <div className="record-audio-save-button-container">
          <Button variant={'dark'} onClick={handleSaveClick} className="record-audio-save-button">
            save
          </Button>
        </div>
      </div>
    </PopupModal>
  );

  function getAudioPlayer() {
    return (
      <div className="record-audio-audio-player">
        <audio src={mediaBlobUrl} controls />
        <Button onClick={clearMedia} variant="invisible">
          <TrashIcon variant="dark" />
        </Button>
      </div>
    );
  }

  function getAudioRecorder() {
    const isRecording = status === 'recording';
    return (
      <div className="record-audio-microphone-container">
        {isRecording ? 'recording. click to stop...' : 'click to start recording...'}
        <button
          className={`record-audio-microphone-icon-button ${isRecording ? 'is-recording' : ''}`}
          onClick={isRecording ? stopRecording : startRecording}
        >
          <MicrophoneIcon
            className="record-audio-microphone-icon"
            variant={isRecording ? 'white' : 'dark'}
          />
        </button>
      </div>
    );
  }
};
