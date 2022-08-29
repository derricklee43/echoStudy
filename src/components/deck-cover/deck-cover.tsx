import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Deck } from '../../models/deck';
import { Button } from '../button/button';
import { FlipTile } from '../flip-tile/flip-tile';
import { ProgressBar } from '../progress-bar/progress-bar';
import './deck-cover.scss';

interface DeckCoverProps {
  flippable?: boolean;
  deck: Deck;
  onClick?: (event: React.MouseEvent) => void;
  onStudyClick: () => void;
  onViewClick: () => void;
}

export const DeckCover = ({
  flippable = true,
  deck,
  onClick,
  onStudyClick,
  onViewClick,
}: DeckCoverProps) => {
  // false => show front; true => show back
  const [flipped, setFlipped] = useState(false);

  const springTransition = {
    type: 'spring',
    damping: 25,
    stiffness: 120,
  };

  return (
    <motion.div key={deck.metaData.id} layout transition={springTransition} className="deck-cover">
      <FlipTile
        isFlipped={flippable && flipped}
        front={getCoverFront()}
        back={getCoverBack()}
        onClick={onClickHandler}
      />
    </motion.div>
  );

  function onClickHandler(event: React.MouseEvent) {
    flippable && setFlipped(!flipped);
    onClick?.(event);
  }

  function getCoverFront() {
    return <div className="cover-front">{deck.metaData.title}</div>;
  }

  function getCoverBack() {
    const percentStudied = 1;
    return (
      <div className="cover-back">
        <label>{deck.metaData.title}</label>
        <p>{deck.metaData.desc}</p>
        <div className="button-strip">
          <div className="progress-bar">
            <ProgressBar percent={percentStudied} label={`${percentStudied}% studied`} />
          </div>
          <Button bubbleOnClickEvent={false} onClick={onViewClick}>
            view
          </Button>
          <Button bubbleOnClickEvent={false} onClick={onStudyClick}>
            study
          </Button>
        </div>
      </div>
    );
  }
};
