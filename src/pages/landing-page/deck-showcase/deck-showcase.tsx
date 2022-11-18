import React from 'react';
import { DeckCover } from '@/components/deck-cover/deck-cover';
import { noop } from '@/helpers/func';
import { testEnglishDeck } from '@/models/mock/deck.mock';
import './deck-showcase.scss';

// TODO: somehow only render this if "visible"
export const DeckShowcase = () => {
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
