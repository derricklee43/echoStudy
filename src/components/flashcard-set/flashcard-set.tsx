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
  const [activeCard, setActiveCard] = useState('');
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
        <Reorder.Item key={card.id ?? card.key} value={card}>
          <Flashcard
            card={card}
            index={index + 1}
            variant={getCardVariant(card.key)}
            onFocus={() => setActiveCard(card.key)}
            onCardChange={(c) => handleCardChange(c, index)}
            onDownClick={() => handleDownClick(index)}
            onUpClick={() => handleUpClick(index)}
            onRemoveClick={() => handleRemoveClick(index)}
          />
        </Reorder.Item>
      );
    });
  }

  function getCardVariant(cardKey: string) {
    if (variant === 'readonly') return 'readonly';
    return activeCard === cardKey ? 'active' : 'inactive';
  }

  function handleRemoveClick(index: number) {
    const newCards = [...cards];
    newCards.splice(index, 1);
    handleCardsChange(newCards);
  }

  function handleUpClick(index: number) {
    const newCards = [...cards];
    newCards[index] = newCards.splice(index - 1, 1, cards[index])[0];
    handleCardsChange(newCards);
  }

  function handleDownClick(index: number) {
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

  function handleCardChange(newCard: Card, index: number) {
    const newCards = [...cards];
    newCards[index] = newCard;
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
