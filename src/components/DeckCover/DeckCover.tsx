import React from 'react';
import './DeckCover.scss';
import { FlipTile } from '../FlipTile/FlipTile';
import { Button } from '../Button/Button';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { Deck } from '../../models/Deck';

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
    const percentStudied = 77;
    return (
      <div className="cover-back">
        <label>{deck.title}</label>
        <p>{deck.desc}</p>
        <div className="button-strip">
          <div className="progress-bar">
            <ProgressBar
              percent={percentStudied}
              label={`${percentStudied}% studied`}
              variant="labelOnTop"
            />
          </div>
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
