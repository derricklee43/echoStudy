import './study-page.scss';
import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/page-header/page-header';
import { useParams } from 'react-router-dom';
import { useDecksClient } from '../../hooks/api/use-decks-client';
import { useCardsClient } from '../../hooks/api/use-cards-client';
import { Deck } from '../../models/deck';
import { LoadingPage } from '../../components/loading-page/loading-page';
import { noop } from '../../helpers/func';
import { usePlayLesson } from '../../hooks/use-play-lesson';
import { StudyFlashcard } from '../../components/study-flashcard/study-flashcard';
import { ProgressBar } from '../../components/progress-bar/progress-bar';
import { AudioControlBar } from '../../components/audio-control-bar/audio-control-bar';

export const StudyPage = () => {
  const { deckId } = useParams(); // via the param :deckId
  const { getDeckById } = useDecksClient();
  const { getCardsByDeckId } = useCardsClient();
  const [deck, setDeck] = useState<Deck | undefined>();
  const [activeCardKey, activeText, startLesson, pauseLesson, resumeLesson] = usePlayLesson();
  const [count, setCount] = useState(-2);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    fetchDeckAndRefresh();
  }, [deckId]);

  useEffect(() => {
    setCount(count + 1); // TODO: Dummy incrementor. Replace with actual progress system
  }, [activeCardKey]);

  if (deck === undefined) {
    return <LoadingPage label="loading deck..." />;
  }

  const currentCard = findCard(activeCardKey);

  return (
    <div className="study-page">
      <PageHeader label={deck.metaData.title} onGoBackClick={noop} goBackLabel="Go back" />
      <div className="study-page-content">
        <StudyFlashcard
          key={currentCard?.key ?? 'deck-cover'}
          variant={activeCardKey === '' ? 'dark' : 'light'}
          frontContent={currentCard?.front.text ?? deck.metaData.title}
          backContent={currentCard?.back.text}
          backLabel="definition"
          frontLabel={activeCardKey ? 'term' : ''}
          activeSide={activeText}
        />
        <ProgressBar
          variant="dark"
          percent={(count / 10) * 100}
          label=""
          className="study-page-progress-bar"
        />
        <AudioControlBar
          isPaused={isPaused}
          onNextClick={noop} // TODO: Add next card feature
          onPlayClick={handlePlayClick}
          onPauseClick={handlePauseClick}
          onPreviousClick={noop} // TODO: Add previous card feature
        />
      </div>
    </div>
  );

  // TODO: Maybe create a Page/Deck fetcher component to extract this boiler plate
  async function fetchDeckAndRefresh() {
    setDeck(undefined);
    if (deckId === undefined) {
      throw new Error('deckId cannot be undefined');
    }
    const deck = await getDeckById(deckId);
    deck.cards = await getCardsByDeckId(deckId);
    setDeck(deck);
  }

  function findCard(key: string) {
    return deck?.cards.find((card) => card.key === key);
  }

  function handlePlayClick() {
    if (deck === undefined) {
      return;
    }
    setIsPaused(false);
    if (activeCardKey === '') {
      return startLesson(deck);
    }
    resumeLesson();
  }

  function handlePauseClick() {
    setIsPaused(true);
    pauseLesson();
  }
};
