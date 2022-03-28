import './card-face.scss';
import React from 'react';
import { ReactComponent as Speaker } from '../../../assets/svg/speaker.svg';
import { ReactComponent as KebabMenu } from '../../../assets/svg/kebab-menu.svg';
import { Button } from '../../button/button';

// Todo: overflow scroll

interface CardFaceProps {
  variant?: 'active' | 'inactive' | 'readonly';
  className?: string;
  value: string;
  onValueChange?: (event: React.FormEvent<HTMLInputElement>) => void;
  onSpeakerClick?: (event: React.MouseEvent) => void;
  onKebabMenuClick?: (event: React.MouseEvent) => void;
  onFaceClick?: (event: React.MouseEvent) => void;
  onFocus?: () => void;
}

export const CardFace = ({
  variant = 'inactive',
  className = '',
  value,
  onValueChange,
  onFocus,
  onFaceClick,
  onSpeakerClick,
  onKebabMenuClick,
}: CardFaceProps) => {
  return (
    <div className={`card-face ${variant} ${className}`} onClick={onFaceClick}>
      <div className="button-strip">{variant === 'active' && getCardFaceButtons()}</div>
      <input className="content" value={value} onChange={handleValueChange} onFocus={onFocus} />
    </div>
  );

  function getCardFaceButtons() {
    return (
      <>
        <Button onClick={handleSpeakerClick} variant="invisible" bubbleOnClickEvent={false}>
          <Speaker className="speaker" />
        </Button>
        <Button onClick={handleKebabMenuClick} variant="invisible" bubbleOnClickEvent={false}>
          <KebabMenu className="kebab-menu" />
        </Button>
      </>
    );
  }

  function handleValueChange(event: React.FormEvent<HTMLInputElement>) {
    if (onValueChange !== undefined) {
      onValueChange(event);
    }
  }

  function handleSpeakerClick(event: React.MouseEvent) {
    if (onSpeakerClick !== undefined) {
      onSpeakerClick(event);
    }
  }

  function handleKebabMenuClick(event: React.MouseEvent) {
    if (onKebabMenuClick !== undefined) {
      onKebabMenuClick(event);
    }
  }
};
