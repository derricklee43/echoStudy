import './flashcard-set.scss';
import React from 'react';
import { Flashcard } from '../flashcard/flashcard';
import { Card } from '../../models/card';

interface ReadOnlyFlashcardSetProps {
  className?: string;
  cards: Card[];
}

export const ReadOnlyFlashcardSet = ({ className = '', cards }: ReadOnlyFlashcardSetProps) => {
  const flashcards = cards.map((card) => (
    <div key={card.id}>
      <Flashcard card={card} variant="inactive" />
    </div>
  ));
  return <div className={`c-flashcard-set ${className}`}>{flashcards}</div>;
};
