import './flashcard-set.scss';
import React from 'react';
import { Flashcard } from '../flashcard/flashcard';
import { useState } from 'react';
import { Reorder } from 'framer-motion';
import { Card } from '../../models/card';

interface FlashcardSetProps {
  variant?: 'readonly' | 'editable';
  className?: string;
  cards: Card[];
  onCardsChange?: (cards: Card[]) => void;
}

export const FlashcardSet = ({
  variant = 'editable',
  className = '',
  cards,
  onCardsChange,
}: FlashcardSetProps) => {
  const [activeCard, setActiveCard] = useState(-1);
  return (
    <div className={`c-flashcard-set ${className}`}>
      <Reorder.Group axis="y" values={cards} onReorder={handleReorder}>
        {getCards()}
      </Reorder.Group>
    </div>
  );

  function getCards() {
    return cards.map((card, index) => {
      return (
        <Reorder.Item key={card.id} value={card}>
          <Flashcard
            card={card}
            index={index + 1}
            variant={getCardVariant(card.id)}
            onFocus={() => setActiveCard(card.id)}
            onCardChange={(c) => handleCardChange(c, index)}
            onDownClick={() => handleDownClick(index)}
            onUpClick={() => handleUpClick(index)}
            onRemoveClick={() => handleRemoveClick(index)}
          />
        </Reorder.Item>
      );
    });
  }

  function getCardVariant(cardId: number) {
    if (variant === 'readonly') return 'readonly';
    return activeCard === cardId ? 'active' : 'inactive';
  }

  function handleRemoveClick(index: number) {
    // Todo deep copy
    const newCards = [...cards];
    newCards.splice(index, 1);
    handleCardsChange(newCards);
  }

  function handleUpClick(index: number) {
    // Todo deep copy
    const newCards = [...cards];
    newCards[index] = newCards.splice(index - 1, 1, cards[index])[0];
    handleCardsChange(newCards);
  }

  function handleDownClick(index: number) {
    // Todo deep copy
    if (index === cards.length - 1) {
      const newCards = [...cards];
      const [lastCard] = newCards.splice(index, 1);
      handleCardsChange([lastCard, ...newCards]);
    } else {
      const newCards = [...cards];
      newCards[index] = newCards.splice(index + 1, 1, cards[index])[0];
      handleCardsChange(newCards);
    }
  }

  function handleCardChange(newCard: Card, id: number) {
    // Todo deep copy
    const newCards = [...cards];
    newCards[id] = newCard;
    handleCardsChange(newCards);
  }

  function handleReorder(newCards: Card[]) {
    handleCardsChange(newCards);
  }

  function handleCardsChange(newCards: Card[]) {
    if (variant === 'editable') {
      onCardsChange?.(newCards);
    }
  }
};
