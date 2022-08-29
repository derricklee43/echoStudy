import './card-face.scss';
import React, { useRef } from 'react';
import { Button } from '../../button/button';
import { CardContent, CardLanguage } from '../../../models/card-content';
import { SpeakerIcon } from '../../../assets/icons/speaker-icon/speaker-icon';
import { CardMenu } from './card-menu/card-menu';
import TextareaAutoSize from 'react-textarea-autosize';

interface CardFaceProps {
  cardContent: CardContent;
  placeholder?: string;
  changeLanguageLabel?: string;
  swapContentLabel?: string;
  variant?: 'active' | 'inactive' | 'readonly';
  className?: string;
  onChange?: (cardContent: CardContent) => void;
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onSpeakerClick?: (audioFile?: HTMLAudioElement) => void;
  onSwapContentClick?: () => void;
}

export const CardFace = ({
  cardContent,
  placeholder,
  changeLanguageLabel,
  swapContentLabel,
  variant = 'inactive',
  className = '',
  onSpeakerClick,
  onChange,
  onFocus,
  onSwapContentClick,
}: CardFaceProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const isReadonly = variant === 'readonly';
  const hasText = cardContent.text.length !== 0;

  return (
    <div className={`card-face ${className} ${variant}`} onClick={handleCardFaceClick}>
      {isReadonly && hasText && getSpeaker()}
      {variant === 'active' && (
        <CardMenu
          language={cardContent.language}
          changeLanguageLabel={changeLanguageLabel ?? ''}
          swapContentLabel={swapContentLabel ?? ''}
          onLanguageChange={handleLanguageChange}
          onSwapContentClick={() => onSwapContentClick?.()}
        />
      )}
      <TextareaAutoSize
        disabled={isReadonly}
        className="card-face-textarea"
        placeholder={!isReadonly ? placeholder : undefined}
        value={cardContent.text}
        onChange={handleCardTextChange}
        onFocus={onFocus}
        ref={textAreaRef}
      />
    </div>
  );

  function getSpeaker() {
    return (
      <Button
        onClick={() => onSpeakerClick?.(cardContent.audio)}
        variant="invisible"
        bubbleOnClickEvent={false}
        className="card-face-button"
        ariaLabel="speaker"
      >
        <SpeakerIcon />
      </Button>
    );
  }

  function handleCardFaceClick() {
    textAreaRef.current?.focus?.();
  }

  function handleCardTextChange(event: React.FormEvent<HTMLTextAreaElement>) {
    onChange?.({ ...cardContent, text: event.currentTarget.value });
  }

  function handleLanguageChange(language: CardLanguage) {
    onChange?.({ ...cardContent, language });
  }
};
