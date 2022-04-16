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
  onDeleteCardClick?: (card: Card) => void;
  onCardReorder?: (cards: Card[]) => void;
  onCardChange?: (card: Card) => void;
}

export const FlashcardSet = ({
  variant = 'editable',
  className = '',
  cards,
  onCardReorder,
  onDeleteCardClick,
  onCardChange,
}: FlashcardSetProps) => {
  const [activeCard, setActiveCard] = useState('');
  return (
    <div className={`c-flashcard-set ${className}`}>
      <Reorder.Group axis="y" values={cards} onReorder={handleCardReorder}>
        {getCards()}
      </Reorder.Group>
    </div>
  );

  function getCards() {
    return cards.map((card, index) => {
      return (
        <Reorder.Item key={card.key} value={card}>
          <Flashcard
            card={card}
            index={index + 1}
            variant={getCardVariant(card.key)}
            onFocus={() => setActiveCard(card.key)}
            onCardChange={(card) => variant === 'editable' && onCardChange?.(card)}
            onDownClick={() => handleDownClick(index)}
            onUpClick={() => handleUpClick(index)}
            onRemoveClick={() => variant === 'editable' && onDeleteCardClick?.(card)}
            onSpeakerClick={handleSpeakerClick}
          />
        </Reorder.Item>
      );
    });
  }

  function getCardVariant(cardKey: string) {
    if (variant === 'readonly') return 'readonly';
    return activeCard === cardKey ? 'active' : 'inactive';
  }

  function handleUpClick(index: number) {
    const newCards = [...cards];
    newCards[index] = newCards.splice(index - 1, 1, cards[index])[0];
    handleCardReorder(newCards);
  }

  function handleDownClick(index: number) {
    if (index === cards.length - 1) {
      const newCards = [...cards];
      const [lastCard] = newCards.splice(index, 1);
      handleCardReorder([lastCard, ...newCards]);
    } else {
      const newCards = [...cards];
      newCards[index] = newCards.splice(index + 1, 1, cards[index])[0];
      handleCardReorder(newCards);
    }
  }

  function handleCardReorder(newCards: Card[]) {
    if (variant === 'editable') {
      onCardReorder?.(newCards);
    }
  }

  function handleSpeakerClick(audioFile: HTMLAudioElement) {
    if (variant === 'readonly') {
      // Todo: play audio
      // I assume we are going to need some kind of audio orchestration to allow only one audio file to play
      // and not queue them
      console.log('Speaker clicked');
    }
  }
};
