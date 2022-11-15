import React, { useEffect, useRef } from 'react';
import { Card, CardSide, swapCardSides } from '@/models/card';
import { CardContent } from '@/models/card-content';
import { CardFace } from './card-face/card-face';
import './flashcard.scss';

interface FlashcardProps {
  card: Card;
  variant: 'active' | 'inactive';
  onCardChange: (card: Card) => void;
  onFocus: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onRecordAudioClick: (side: CardSide) => void;
}

export const Flashcard = ({
  variant,
  card,
  onCardChange,
  onFocus,
  onRecordAudioClick,
}: FlashcardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => scrollIntoViewIfActive(), [variant]);

  return (
    <div ref={cardRef} className={`flashcard ${variant}`}>
      <CardFace
        variant={variant}
        cardSide={'front'}
        cardContent={card.front}
        onFocus={onFocus}
        onChange={handleFrontFaceChange}
        onSwapContentClick={handleSwapContentClick}
        onRecordAudioClick={() => onRecordAudioClick('front')}
      />
      <CardFace
        variant={variant}
        cardSide={'back'}
        className="back"
        cardContent={card.back}
        onFocus={onFocus}
        onChange={handleBackFaceChange}
        onSwapContentClick={handleSwapContentClick}
        onRecordAudioClick={() => onRecordAudioClick('back')}
      />
    </div>
  );

  function handleFrontFaceChange(cardContent: CardContent) {
    onCardChange({ ...card, front: cardContent });
  }

  function handleBackFaceChange(cardContent: CardContent) {
    onCardChange({ ...card, back: cardContent });
  }

  function isCardInViewPort(cardDiv: HTMLDivElement) {
    const { top, bottom } = cardDiv.getBoundingClientRect();
    return bottom >= 0 && top <= (window.innerHeight || document.documentElement.clientHeight);
  }

  function handleSwapContentClick() {
    onCardChange(swapCardSides(card));
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
