import React, { useRef } from 'react';
import TextareaAutoSize from 'react-textarea-autosize';
import { CardSide } from '@/models/card';
import { CardContent } from '@/models/card-content';
import { CardMenu } from './card-menu/card-menu';
import './card-face.scss';

interface CardFaceProps {
  cardSide: CardSide;
  cardContent: CardContent;
  variant: 'active' | 'inactive';
  className?: string;
  onChange: (cardContent: CardContent) => void;
  onFocus: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onSwapContentClick: () => void;
  onRecordAudioClick: () => void;
}

export const CardFace = ({
  cardContent,
  cardSide,
  variant,
  className = '',
  onChange,
  onFocus,
  onSwapContentClick,
  onRecordAudioClick,
}: CardFaceProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const cardSideLabel = cardSide === 'front' ? 'term' : 'definition';
  const placeholder = `add ${cardSideLabel}`;
  return (
    <div className={`card-face ${className} ${variant}`} onClick={handleCardFaceClick}>
      {variant === 'active' && (
        <CardMenu
          cardContent={cardContent}
          cardSide={cardSide}
          onCardContentChange={onChange}
          onSwapContentClick={onSwapContentClick}
          onRecordAudioClick={onRecordAudioClick}
        />
      )}
      <TextareaAutoSize
        className="card-face-textarea"
        placeholder={placeholder}
        value={cardContent.text}
        onChange={handleCardTextChange}
        onFocus={onFocus}
        ref={textAreaRef}
      />
    </div>
  );

  function handleCardFaceClick() {
    textAreaRef.current?.focus?.();
  }

  function handleCardTextChange(event: React.FormEvent<HTMLTextAreaElement>) {
    onChange({ ...cardContent, text: event.currentTarget.value });
  }
};
