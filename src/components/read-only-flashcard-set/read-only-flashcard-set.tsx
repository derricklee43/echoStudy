import './read-only-flashcard-set.scss';
import React from 'react';
import { Flashcard } from '../flashcard/flashcard';
import { Card } from '../../models/card';

interface ReadOnlyFlashcardSetProps {
  className?: string;
  cards: Card[];
}

export const ReadOnlyFlashcardSet = ({ className = '', cards }: ReadOnlyFlashcardSetProps) => {
  const flashcards = cards.map((card) => (
    <div key={card.key}>
      <Flashcard card={card} variant="readonly" onSpeakerClick={handleSpeakerClick} />
    </div>
  ));
  return <div className={`c-read-only-flashcard-set ${className}`}>{flashcards}</div>;
};

function handleSpeakerClick(audioFile?: HTMLAudioElement) {
  if (audioFile === undefined) {
    console.error('Audio file was undefined');
    return;
  }
  audioFile.play();
}