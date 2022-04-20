import './card-face.scss';
import React from 'react';
import { Button } from '../../button/button';
import { CardContent } from '../../../models/card-content';
import { SpeakerIcon } from '../../../assets/icons/speaker-icon/speaker-icon';
import { KebabMenuIcon } from '../../../assets/icons/kebab-menu-icon/kebab-menu-icon';

interface CardFaceProps {
  cardContent: CardContent;
  variant?: 'active' | 'inactive' | 'readonly';
  className?: string;
  placeholder?: string;
  onChange?: (cardContent: CardContent) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onSpeakerClick?: (audioFile: HTMLAudioElement) => void;
}

export const CardFace = ({
  cardContent,
  variant = 'inactive',
  className = '',
  placeholder,
  onSpeakerClick,
  onChange,
  onFocus,
}: CardFaceProps) => {
  const isReadonly = variant === 'readonly';
  const hasText = cardContent.text.length !== 0;

  return (
    <div className={`card-face ${className}`}>
      {isReadonly && hasText && getSpeaker()}
      {variant === 'active' && getKababMenu()}
      <input
        disabled={isReadonly}
        className={`content ${variant}`}
        placeholder={!isReadonly ? placeholder : undefined}
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

  function getKababMenu() {
    return (
      <Button
        onClick={handleKebabClick}
        variant="invisible"
        bubbleOnClickEvent={false}
        className="card-face-button card-face-kebab-menu"
        ariaLabel="kebab-menu"
      >
        <KebabMenuIcon />
      </Button>
    );
  }

  function handleCardTextChange(event: React.FormEvent<HTMLInputElement>) {
    onChange?.({ ...cardContent, text: event.currentTarget.value });
  }

  function handleKebabClick() {
    console.log('kebab clicked!');
  }
};
