import React, { useRef } from 'react';
import TextareaAutoSize from 'react-textarea-autosize';
import { CardContent } from '@/models/card-content';
import { CardLanguage } from '@/models/language';
import { CardMenu } from './card-menu/card-menu';
import './card-face.scss';

interface CardFaceProps {
  cardContent: CardContent;
  placeholder: string;
  changeLanguageLabel: string;
  swapContentLabel: string;
  variant: 'active' | 'inactive';
  className?: string;
  onChange: (cardContent: CardContent) => void;
  onFocus: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onSwapContentClick: () => void;
  onRecordAudioClick: () => void;
}

export const CardFace = ({
  cardContent,
  placeholder,
  changeLanguageLabel,
  swapContentLabel,
  variant,
  className = '',
  onChange,
  onFocus,
  onSwapContentClick,
  onRecordAudioClick,
}: CardFaceProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className={`card-face ${className} ${variant}`} onClick={handleCardFaceClick}>
      {variant === 'active' && (
        <CardMenu
          cardContent={cardContent}
          changeLanguageLabel={changeLanguageLabel}
          swapContentLabel={swapContentLabel}
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
