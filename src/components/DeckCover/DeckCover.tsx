import './DeckCover.scss';
import React from 'react';
import { FlipTile } from '../FlipTile/FlipTile';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { Button } from '../Button/Button';

interface Deck {
  title: string;
  summary: string;
}

interface DeckCoverProps {
  isActive: boolean;
  deck: Deck;
  onClick: (event: React.MouseEvent) => void;
  onStudyClick: () => void;
  onEditClick: () => void;
}

export const DeckCover = ({
  deck,
  isActive,
  onClick,
  onStudyClick,
  onEditClick,
}: DeckCoverProps) => {
  return (
    <FlipTile
      className="deck-cover"
      isFlipped={isActive}
      front={getCoverFront()}
      back={getCoverBack()}
      onClick={onClick}
    />
  );

  function getCoverFront() {
    return <div className="cover-front">{deck.title}</div>;
  }

  function getCoverBack() {
    return (
      <div className="cover-back">
        <label>{deck.title}</label>
        <p>{deck.summary}</p>
        <div className="button-strip">
          <ProgressBar percentComplete={50} />
          <Button bubbleOnClickEvent={false} onClick={onEditClick}>
            edit
          </Button>
          <Button bubbleOnClickEvent={false} onClick={onStudyClick}>
            study
          </Button>
        </div>
      </div>
    );
  }
};
