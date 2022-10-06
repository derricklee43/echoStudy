import React from 'react';
import { SpeakerIcon } from '@/assets/icons/speaker-icon/speaker-icon';
import { Button } from '@/components/button/button';
import './read-only-flashcard.scss';

export type ReadOnlyFlashcardVariant = 'red' | 'green' | 'light-blue';

interface ReadOnlyFlashcardProps {
  className?: string;
  frontText: string;
  backText: string;
  onBackSpeakerClick: () => void;
  onFrontSpeakerClick: () => void;
  variant: ReadOnlyFlashcardVariant;
}

export const ReadOnlyFlashcard = ({
  className = '',
  variant,
  frontText,
  backText,
  onFrontSpeakerClick,
  onBackSpeakerClick,
}: ReadOnlyFlashcardProps) => {
  return (
    <div className={`read-only-flashcard ${variant} ${className}`}>
      <div className="rof-card-face">
        <div className="rof-button-strip">{getSpeaker(frontText, onFrontSpeakerClick)}</div>
        <div className="rof-content">{frontText}</div>
        <div className="rof-button-strip"></div>
      </div>
      <div className="rof-card-face">
        <div className="rof-button-strip">{getSpeaker(backText, onBackSpeakerClick)}</div>
        <div className="rof-content">{backText}</div>
        <div className="rof-button-strip"></div>
      </div>
    </div>
  );

  function getSpeaker(text: string, onClick: () => void) {
    if (text === '') {
      return undefined;
    }
    return (
      <Button onClick={onClick} variant="invisible" ariaLabel="speaker">
        <SpeakerIcon className="rof-speaker-icon" variant={variant} />
      </Button>
    );
  }
};
