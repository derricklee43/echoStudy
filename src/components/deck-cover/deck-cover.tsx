import './deck-cover.scss';
import React from 'react';
import { FlipTile } from '../flip-tile/flip-tile';
import { ProgressBar } from '../progress-bar/progress-bar';
import { Button } from '../button/button';

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
          <Button variant="dark" bubbleOnClickEvent={false} onClick={onEditClick}>
            edit
          </Button>
          <Button variant="dark" bubbleOnClickEvent={false} onClick={onStudyClick}>
            study
          </Button>
        </div>
      </div>
    );
  }
};
