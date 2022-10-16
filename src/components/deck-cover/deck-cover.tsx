import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/button/button';
import { FlipTile } from '@/components/flip-tile/flip-tile';
import { ProgressBar } from '@/components/progress-bar/progress-bar';
import { Deck } from '@/models/deck';
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
        frontClassName="cover-front"
        front={deck.metaData.title}
        back={getCoverBack()}
        backClassName="cover-back"
        onClick={onClickHandler}
      />
    </motion.div>
  );

  function onClickHandler(event: React.MouseEvent) {
    flippable && setFlipped(!flipped);
    onClick?.(event);
  }

  function getCoverBack() {
    // TODO: We might have some reworking to do.
    // I guessing we do not want to grab all the cards for every deck just
    // calculate the percentStudied
    // Maybe we should add a property to the deck
    const percentStudied = 57;
    return (
      <>
        <label>{deck.metaData.title}</label>
        <p>{deck.metaData.desc}</p>
        <div className="button-strip">
          <ProgressBar
            variant="gradient"
            className="deck-cover-progress-bar"
            percent={Math.max(percentStudied, 15)} // looks ugly at <15
            label={`${percentStudied}% studied`}
          />
          <Button bubbleOnClickEvent={false} onClick={onViewClick}>
            view
          </Button>
          <Button bubbleOnClickEvent={false} onClick={onStudyClick}>
            study
          </Button>
        </div>
      </>
    );
  }
};
