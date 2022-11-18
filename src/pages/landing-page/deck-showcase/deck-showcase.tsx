import React, { RefObject } from 'react';
import { DeckCover } from '@/components/deck-cover/deck-cover';
import { noop } from '@/helpers/func';
import { useIsInViewport } from '@/hooks/use-is-in-viewport';
import { testEnglishDeck } from '@/models/mock/deck.mock';
import './deck-showcase.scss';

interface DeckShowcaseProps {
  showWhenVisibleRef: RefObject<HTMLElement>;
}

export const DeckShowcase = ({ showWhenVisibleRef }: DeckShowcaseProps) => {
  const { inViewport } = useIsInViewport(showWhenVisibleRef, true);

  if (inViewport === false) {
    return null;
  }

  return (
    <div className="showcase-deck-preview">
      <div className="column left">
        {[...Array(4)].map((_val, index) => {
          return getDeckCover(index, index % 2 == 0);
        })}
      </div>
      <div className="column right">
        {[...Array(4)].map((_val, index) => {
          return getDeckCover(index + 4, index % 2 == 1);
        })}
      </div>
    </div>
  );

  function getDeckCover(index: number, startFlipped: boolean) {
    console.log(startFlipped);
    return (
      <DeckCover
        className="deck-showcase-cover"
        deck={testEnglishDeck(
          index
        )} /* TODO: create a bunch of test decks for this page, maybe get rid of this method */
        startFlipped={startFlipped}
        onStudyClick={noop}
        onViewClick={noop}
      />
    );
  }
};
