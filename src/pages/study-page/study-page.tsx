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
import { StudyFlashcard } from '../../components/study-flashcard/study-flashcard';

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
      <div className="study-page-content">
        <StudyFlashcard
          variant={activeCardKey === '' ? 'dark' : 'light'}
          backContent={findCard(activeCardKey)?.back.text}
          frontContent={findCard(activeCardKey)?.front.text ?? deck.metaData.title}
          activeSide={activeText}
        />

        <div className="button-menu">
          {activeCardKey === '' ? (
            <Button onClick={playAudio}>start lesson</Button>
          ) : (
            <>
              <Button onClick={pauseLesson}>pause</Button>
              <Button onClick={resumeLesson}>resume</Button>
            </>
          )}
        </div>
      </div>
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

  function findCard(key: string) {
    return deck?.cards.find((card) => card.key === key);
  }
};
