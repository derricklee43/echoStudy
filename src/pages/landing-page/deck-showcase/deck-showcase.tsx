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
        {getDeckCover(testStage20LatinDeck())}
        {getDeckCover(testChemPolyatomicIonsDeck(), true)}
        {getDeckCover(testBiologyMedSchoolDeck())}
        {getDeckCover(testEnglishDeck(), true)}
        {getDeckCover(testMusicTheoryDeck())}
      </div>
      <div className="column right">
        {getDeckCover(testGermanFairytalesDeck())}
        {getDeckCover(testJapaneseVerbsDeck())}
        {getDeckCover(testCalcMidtermDeck(), true)}
        {getDeckCover(testNPTEPartNumberDeck(1))}
        {getDeckCover(testEasySpanishVocabDeck())}
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
