import './card-face.scss';
import React from 'react';
import { ReactComponent as Speaker } from '../../../assets/svg/speaker.svg';
import { ReactComponent as KebabMenu } from '../../../assets/svg/kebab-menu.svg';
import { Button } from '../../button/button';
import { CardContent } from '../../../models/card-content';

interface CardFaceProps {
  cardContent: CardContent;
  variant?: 'active' | 'inactive' | 'readonly';
  className?: string;
  placeholder?: string;
  onChange?: (cardContent: CardContent) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export const CardFace = ({
  cardContent,
  variant = 'inactive',
  className = '',
  placeholder,
  onChange,
  onFocus,
}: CardFaceProps) => {
  return (
    <div className={`card-face ${className}`}>
      {variant === 'active' && getButtonStrip()}
      <input
        disabled={variant === 'readonly'}
        className={`content ${variant}`}
        placeholder={placeholder}
        value={cardContent.text}
        onChange={handleCardTextChange}
        onFocus={onFocus}
      />
    </div>
  );

  function getButtonStrip() {
    return (
      <div className="button-strip">
        <Button onClick={playAudio} variant="invisible" bubbleOnClickEvent={false}>
          <Speaker className="speaker" />
        </Button>
        <Button onClick={handleKebabClick} variant="invisible" bubbleOnClickEvent={false}>
          <KebabMenu className="kebab-menu" />
        </Button>
      </div>
    );
  }

  function handleCardTextChange(event: React.FormEvent<HTMLInputElement>) {
    onChange?.({ ...cardContent, text: event.currentTarget.value });
  }

  function playAudio() {
    cardContent.audio.play();
  }

  function handleKebabClick() {
    console.log('kebab clicked!');
  }
};
