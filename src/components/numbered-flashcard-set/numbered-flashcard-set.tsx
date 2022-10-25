import React from 'react';
import { ReadOnlyFlashcard } from '@/components/read-only-flashcard/read-only-flashcard';
import { useLazyAudioPlayer } from '@/hooks/use-lazy-audio-player';
import { Card } from '@/models/card';
import './numbered-flashcard-set.scss';

interface NumberedFlashcardSetProps {
  className?: string;
  emptySetLabel: string;
  cards: Card[];
}

export const NumberedFlashcardSet = ({
  className,
  cards,
  emptySetLabel,
}: NumberedFlashcardSetProps) => {
  const { playLazyAudio } = useLazyAudioPlayer();

  const emptySetMessage = (
    <div className="c-numbered-flashcard-empty-set-label">{emptySetLabel}</div>
  );

  const numberedFlashcards = cards.map((card, index) => (
    <div className="c-numbered-flashcard-container" key={card.key}>
      <div className="c-numbered-flashcard-index">{`${index + 1}.`}</div>
      <ReadOnlyFlashcard
        className="c-numbered-flashcard"
        variant="light-blue"
        frontText={card.front.text}
        backText={card.back.text}
        onFrontSpeakerClick={() => playLazyAudio(card.front.audio)}
        onBackSpeakerClick={() => playLazyAudio(card.back.audio)}
      />
    </div>
  ));

  return (
    <div className={`${className}`}>
      {cards.length === 0 ? emptySetMessage : numberedFlashcards}
    </div>
  );
};
