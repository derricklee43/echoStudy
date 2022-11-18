import React, { RefObject } from 'react';
import { DeckCover } from '@/components/deck-cover/deck-cover';
import { noop } from '@/helpers/func';
import { useIsInViewport } from '@/hooks/use-is-in-viewport';
import { Deck } from '@/models/deck';
import {
  testChemPolyatomicIonsDeck,
  testEnglishDeck,
  testExamStudyDeck,
  testGermanFairytalesDeck,
  testJapaneseVerbsDeck,
  testNPTEPartNumberDeck,
  testStage20LatinDeck,
} from '@/models/mock/deck.mock';
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
        {getDeckCover(testStage20LatinDeck(nextId++), false)}
        {getDeckCover(testNPTEPartNumberDeck(nextId++, 1), false)}
        {getDeckCover(testExamStudyDeck(nextId++), true)}
        {getDeckCover(testEnglishDeck(nextId++), false)}
      </div>
      <div className="column right">
        {getDeckCover(testGermanFairytalesDeck(nextId++), false)}
        {getDeckCover(testJapaneseVerbsDeck(nextId++), true)}
        {getDeckCover(testChemPolyatomicIonsDeck(nextId++), false)}
        {getDeckCover(testStage20LatinDeck(nextId++), false)}
      </div>
    </div>
  );

  function getDeckCover(deck: Deck, startFlipped: boolean) {
    return (
      <DeckCover
        className="deck-showcase-cover"
        deck={deck}
        startFlipped={startFlipped}
        onStudyClick={noop}
        onViewClick={noop}
      />
    );
  }
};

// unique id for generating deck covers
let nextId = 0;
