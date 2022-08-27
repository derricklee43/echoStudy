import './study-page.scss';
import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/page-header/page-header';
import { useParams } from 'react-router-dom';
import { useDecksClient } from '../../hooks/api/use-decks-client';
import { useCardsClient } from '../../hooks/api/use-cards-client';
import { Deck } from '../../models/deck';
import { LoadingPage } from '../../components/loading-page/loading-page';
import { noop } from '../../helpers/func';
import { Button } from '../../components/button/button';
import { usePlayLesson } from '../../hooks/use-play-lesson';

export const StudyPage = () => {
  const { deckId } = useParams(); // via the param :deckId
  const { getDeckById } = useDecksClient();
  const { getCardsByDeckId } = useCardsClient();
  const [deck, setDeck] = useState<Deck | undefined>();
  const [activeCardKey, activeText, startLesson, pauseLesson, resumeLesson] = usePlayLesson();

  useEffect(() => {
    fetchDeckAndRefresh();
  }, [deckId]);

  if (deck === undefined) {
    return <LoadingPage label="loading deck..." />;
  }

  return (
    <div className="study-page">
      <PageHeader label={deck.metaData.title} onGoBackClick={noop} goBackLabel="Go back" />
      <br></br>
      <Button onClick={playAudio} size="medium">
        play audio
      </Button>
      <Button onClick={noop} size="medium">
        {activeCardKey}
      </Button>
      <Button onClick={noop} size="medium">
        {activeText}
      </Button>
      <Button onClick={pauseLesson} size="medium">
        pause
      </Button>
      <Button onClick={resumeLesson} size="medium">
        resume
      </Button>
    </div>
  );

  function playAudio() {
    if (deck !== undefined) startLesson(deck);
  }

  async function fetchDeckAndRefresh() {
    setDeck(undefined);
    if (deckId === undefined) {
      throw new Error('deckId cannot be undefined');
    }
    const deck = await getDeckById(deckId);
    deck.cards = await getCardsByDeckId(deckId);
    setDeck(deck);
  }
};
