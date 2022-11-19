import React, { RefObject } from 'react';
import { DeckCover } from '@/components/deck-cover/deck-cover';
import { noop } from '@/helpers/func';
import { useIsInViewport } from '@/hooks/use-is-in-viewport';
import { Deck } from '@/models/deck';
import {
  testBiologyMedSchoolDeck,
  testCalcMidtermDeck,
  testChemPolyatomicIonsDeck,
  testEasySpanishVocabDeck,
  testEnglishDeck,
  testGermanFairytalesDeck,
  testJapaneseVerbsDeck,
  testMusicTheoryDeck,
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
        {getDeckCover(testStage20LatinDeck(nextId++))}
        {getDeckCover(testChemPolyatomicIonsDeck(nextId++), true)}
        {getDeckCover(testBiologyMedSchoolDeck(nextId++))}
        {getDeckCover(testEnglishDeck(nextId++), true)}
        {getDeckCover(testMusicTheoryDeck(nextId++))}
      </div>
      <div className="column right">
        {getDeckCover(testGermanFairytalesDeck(nextId++))}
        {getDeckCover(testJapaneseVerbsDeck(nextId))}
        {getDeckCover(testCalcMidtermDeck(nextId++), true)}
        {getDeckCover(testNPTEPartNumberDeck(nextId++, 1))}
        {getDeckCover(testEasySpanishVocabDeck(nextId++))}
      </div>
    </div>
  );

  function getDeckCover(deck: Deck, startFlipped?: boolean) {
    return (
      <DeckCover
        className="deck-showcase-cover"
        deck={deck}
        startFlipped={startFlipped ?? false}
        onStudyClick={noop}
        onViewClick={noop}
      />
    );
  }
};

// unique id for generating deck covers
let nextId = 0;
