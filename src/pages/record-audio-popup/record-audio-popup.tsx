import React, { useEffect, useState } from 'react';
import { MicrophoneIcon } from '@/assets/icons/microphone-icon/microphone-icon';
import { TrashIcon } from '@/assets/icons/trash-icon/trash-icon';
import { BubbleTagList } from '@/components/bubble-tag-list/bubble-tag-list';
import { Button } from '@/components/button/button';
import { LoadingPage } from '@/components/loading-page/loading-page';
import { PopupModal } from '@/components/popup-modal/popup-modal';
import { useAudioRecorder } from '@/hooks/use-audio-recorder';
import { CardContent } from '@/models/card-content';
import './record-audio-popup.scss';

interface RecordAudioPopupProps {
  showPopup: boolean;
  cardContent?: CardContent;
  onClose: () => void;
  onSave: (audioUrl: string | undefined, mediaBlob: Blob | undefined) => void;
}

export const RecordAudioPopup = ({
  showPopup,
  cardContent,
  onClose,
  onSave,
}: RecordAudioPopupProps) => {
  const { mediaBlob, audioUrl, isRecording, setAudioUrl, startRecording, stopRecording } =
    useAudioRecorder();

  useEffect(() => {
    setAudioUrl(cardContent?.customAudio?.src);
  }, [cardContent?.customAudio?.src, setAudioUrl]);

  if (cardContent === undefined) {
    return <LoadingPage />;
  }

  return (
    <PopupModal
      headerLabel="record custom card audio"
      showTrigger={showPopup}
      onClose={handleCloseClick}
    >
      <div className="record-audio-popup">
        <BubbleTagList bubbleTags={[{ value: cardContent.language.toLocaleLowerCase() }]} />
        <div className="record-audio-card-face">{cardContent.text}</div>
        {audioUrl === undefined ? getAudioRecorder() : getAudioPlayer()}
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
        <audio src={audioUrl} controls />
        <Button onClick={() => setAudioUrl(undefined)} variant="invisible">
          <TrashIcon variant="dark" />
        </Button>
      </div>
    );
  }

  function getAudioRecorder() {
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

  function handleCloseClick() {
    onClose();
    setAudioUrl(undefined);
  }

  function handleSaveClick() {
    onSave(audioUrl, mediaBlob);
    setAudioUrl(undefined);
  }
};
