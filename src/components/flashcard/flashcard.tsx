import './flashcard.scss';
import React from 'react';
import { CardFace } from './card-face/card-face';
import { Card } from '../../models/card';
import { CardContent } from '../../models/card-content';
import { useEffect } from 'react';
import { useRef } from 'react';

interface FlashcardProps {
  card: Card;
  variant: 'active' | 'inactive';
  onCardChange?: (card: Card) => void;
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onSpeakerClick?: (audioFile?: HTMLAudioElement) => void;
}

export const Flashcard = ({
  variant,
  card,
  onCardChange,
  onFocus,
  onSpeakerClick,
}: FlashcardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => scrollIntoViewIfActive(), [variant]);

  return (
    <div ref={cardRef} className={`flashcard ${variant}`} onMouseDown={() => console.log('here')}>
      <CardFace
        variant={variant}
        placeholder="add term"
        className="front"
        cardContent={card.front}
        onFocus={onFocus}
        onChange={handleFrontFaceChange}
        onSpeakerClick={onSpeakerClick}
      />
      <CardFace
        variant={variant}
        placeholder="add definition"
        className="back"
        cardContent={card.back}
        onFocus={onFocus}
        onChange={handleBackFaceChange}
        onSpeakerClick={onSpeakerClick}
      />
    </div>
  );

  function handleFrontFaceChange(cardContent: CardContent) {
    onCardChange?.({ ...card, front: cardContent });
  }

  function handleBackFaceChange(cardContent: CardContent) {
    onCardChange?.({ ...card, back: cardContent });
  }

  function isCardInViewPort(cardDiv: HTMLDivElement) {
    const { top, bottom } = cardDiv.getBoundingClientRect();
    return bottom >= 0 && top <= (window.innerHeight || document.documentElement.clientHeight);
  }

  function scrollIntoViewIfActive() {
    if (cardRef.current == null || variant !== 'active') {
      return;
    }

    if (!isCardInViewPort(cardRef.current)) {
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }
  }
};
