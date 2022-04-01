import React, { useState } from 'react';
import './deck-cover.scss';
import { FlipTile } from '../flip-tile/flip-tile';
import { ProgressBar } from '../progress-bar/progress-bar';
import { Button } from '../button/button';
import { Deck } from '../../models/deck';

interface DeckCoverProps {
  flippable?: boolean;
  deck: Deck;
  onClick?: (event: React.MouseEvent) => void;
  onStudyClick: () => void;
  onEditClick: () => void;
}

export const DeckCover = ({
  flippable = true,
  deck,
  onClick,
  onStudyClick,
  onEditClick,
}: DeckCoverProps) => {
  // false => show front; true => show back
  const [flipped, setFlipped] = useState(false);

  return (
    <FlipTile
      className="deck-cover"
      isFlipped={flippable && flipped}
      front={getCoverFront()}
      back={getCoverBack()}
      onClick={onClickHandler}
    />
  );

  function onClickHandler(event: React.MouseEvent) {
    flippable && setFlipped(!flipped);
    onClick?.(event);
  }

  function getCoverFront() {
    return <div className="cover-front">{deck.title}</div>;
  }

  function getCoverBack() {
    const percentStudied = 1;
    return (
      <div className="cover-back">
        <label>{deck.title}</label>
        <p>{deck.desc}</p>
        <div className="button-strip">
          <div className="progress-bar">
            <ProgressBar percent={percentStudied} label={`${percentStudied}% studied`} />
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
