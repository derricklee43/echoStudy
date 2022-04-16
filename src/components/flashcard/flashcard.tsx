import './flashcard.scss';
import React from 'react';
import { CardFace } from './card-face/card-face';
import { TrashIcon } from '../../assets/icons/trash-icon/trash-icon';
import { FlashcardArrowIcon } from '../../assets/icons/flashcard-arrow-icon/flashcard-arrow-icon';
import { Button } from '../button/button';
import { Card } from '../../models/card';
import { CardContent } from '../../models/card-content';

interface FlashcardProps {
  card: Card;
  variant: 'active' | 'inactive' | 'readonly';
  index?: number;
  onCardChange?: (card: Card) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
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
  onUpClick,
  onDownClick,
  onRemoveClick,
}: FlashcardProps) => {
  return (
    <div className={`flashcard ${variant}`}>
      {variant !== 'readonly' && getLeftButtonStrip(variant)}
      <CardFace
        variant={variant}
        placeholder="add term"
        className="front"
        cardContent={card.front}
        onFocus={onFocus}
        onChange={handleFrontFaceChange}
      />
      <CardFace
        variant={variant}
        placeholder="add definition"
        className="back"
        cardContent={card.back}
        onFocus={onFocus}
        onChange={handleBackFaceChange}
      />
      {variant !== 'readonly' && getRightButtonStrip(variant)}
    </div>
  );

  function getLeftButtonStrip(variant: 'active' | 'inactive') {
    return (
      <div className="button-strip">
        <Button onClick={(e) => onUpClick?.(e)} variant="invisible">
          <FlashcardArrowIcon orientation="up" variant={variant} />
        </Button>
        <label>{index ?? ''}</label>
        <Button onClick={(e) => onDownClick?.(e)} variant="invisible">
          <FlashcardArrowIcon variant={variant} />
        </Button>
      </div>
    );
  }

  function getRightButtonStrip(variant: 'active' | 'inactive') {
    return (
      <div className="button-strip right">
        <Button onClick={(e) => onRemoveClick?.(e)} variant="invisible">
          <TrashIcon variant={variant} />
        </Button>
      </div>
    );
  }

  function handleFrontFaceChange(cardContent: CardContent) {
    onCardChange?.({ ...card, front: cardContent });
  }

  function handleBackFaceChange(cardContent: CardContent) {
    onCardChange?.({ ...card, back: cardContent });
  }
};
