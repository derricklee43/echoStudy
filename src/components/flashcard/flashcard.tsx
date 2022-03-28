import './flashcard.scss';
import React from 'react';
import { CardFace } from './card-face/card-face';
import { ReactComponent as FlashCardDownArrow } from '../../assets/svg/flashcard-down-arrow.svg';
import { ReactComponent as Trash } from '../../assets/svg/trash.svg';
import { TrashIcon } from '../../assets/icons/trash-icon/trash-icon';
import { FlashcardArrowIcon } from '../../assets/icons/flashcard-arrow-icon/flashcard-arrow-icon';
import { Button } from '../button/button';
import { Card } from '../../models/card';

interface FlashcardProps {
  card: Card;
  index: number;
  variant: 'active' | 'inactive' | 'readonly';
  onFocus?: () => void;
  onCardClick?: (event: React.MouseEvent) => void;
  onCardChange?: (newCard: Card) => void;
  onUpClick?: (event: React.MouseEvent) => void;
  onDownClick?: (event: React.MouseEvent) => void;
  onRemoveClick?: (event: React.MouseEvent) => void;
}

export const Flashcard = ({
  variant,
  index,
  card,
  onCardChange,
  onFocus,
  onCardClick,
  onUpClick,
  onDownClick,
  onRemoveClick,
}: FlashcardProps) => {
  return (
    <div className={`flashcard ${variant}`}>
      {variant !== 'readonly' && getLeftButtonStrip(variant)}
      <CardFace
        variant={variant}
        className="front"
        onFocus={onFocus}
        onFaceClick={handleCardClick}
        onValueChange={setCardFront}
        value={card.front.text}
      />
      <CardFace
        variant={variant}
        className="back"
        onFocus={onFocus}
        onFaceClick={handleCardClick}
        onValueChange={setCardBack}
        value={card.back.text}
      />
      {variant !== 'readonly' && getRightButtonStrip(variant)}
    </div>
  );

  function getLeftButtonStrip(variant: 'active' | 'inactive') {
    return (
      <div className="button-strip">
        <Button onClick={handleUpClick} variant="invisible" bubbleOnClickEvent={false}>
          <FlashcardArrowIcon orientation="up" variant={variant} />
        </Button>
        <label>{index}</label>
        <Button onClick={handleDownClick} variant="invisible" bubbleOnClickEvent={false}>
          <FlashcardArrowIcon variant={variant} />
        </Button>
      </div>
    );
  }

  function setCardFront(event: React.FormEvent<HTMLInputElement>) {
    const newCard = { ...card };
    newCard.front = { ...card.front, text: event.currentTarget.value };
    if (onCardChange !== undefined) {
      onCardChange(newCard);
    }
  }
  function setCardBack(event: React.FormEvent<HTMLInputElement>) {
    const newCard = { ...card };
    newCard.back = { ...card.back, text: event.currentTarget.value };
    if (onCardChange !== undefined) {
      onCardChange(newCard);
    }
  }

  function getRightButtonStrip(variant: 'active' | 'inactive') {
    return (
      <div className="button-strip right">
        <Button onClick={handleRemoveClick} variant="invisible" bubbleOnClickEvent={false}>
          <TrashIcon variant={variant} />
        </Button>
      </div>
    );
  }

  function handleCardClick(event: React.MouseEvent) {
    if (onCardClick !== undefined && !isReadOnly()) {
      onCardClick(event);
    }
  }

  function handleUpClick(event: React.MouseEvent) {
    if (onUpClick !== undefined && !isReadOnly()) {
      onUpClick(event);
    }
  }

  function handleDownClick(event: React.MouseEvent) {
    if (onDownClick !== undefined && !isReadOnly()) {
      onDownClick(event);
    }
  }

  function handleRemoveClick(event: React.MouseEvent) {
    if (onRemoveClick !== undefined && !isReadOnly()) {
      onRemoveClick(event);
    }
  }

  function isReadOnly() {
    return variant === 'readonly';
  }
};
