import './card-face.scss';
import React from 'react';
import { Button } from '../../button/button';
import { CardContent, CardLanguage } from '../../../models/card-content';
import { SpeakerIcon } from '../../../assets/icons/speaker-icon/speaker-icon';
import { CardMenu } from './card-menu/card-menu';

interface CardFaceProps {
  cardContent: CardContent;
  placeholder?: string;
  changeLanguageLabel?: string;
  swapContentLabel?: string;
  variant?: 'active' | 'inactive' | 'readonly';
  className?: string;
  onChange?: (cardContent: CardContent) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
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
  const isReadonly = variant === 'readonly';
  const hasText = cardContent.text.length !== 0;

  return (
    <div className={`card-face ${className}`}>
      {isReadonly && hasText && getSpeaker()}
      {variant === 'active' && (
        <CardMenu
          language={cardContent.language as any}
          changeLanguageLabel={changeLanguageLabel ?? ''}
          swapContentLabel={swapContentLabel ?? ''}
          onLanguageChange={handleLanguageChange}
          onSwapContentClick={() => onSwapContentClick?.()}
        />
      )}
      <input
        disabled={isReadonly}
        className={`content ${variant}`}
        placeholder={isReadonly ? undefined : placeholder}
        value={cardContent.text}
        onChange={handleCardTextChange}
        onFocus={onFocus}
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

  function handleCardTextChange(event: React.FormEvent<HTMLInputElement>) {
    onChange?.({ ...cardContent, text: event.currentTarget.value });
  }

  function handleLanguageChange(language: CardLanguage) {
    onChange?.({ ...cardContent, language });
  }
};
