import './view-deck-page.scss';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDecksClient } from '../../hooks/api/use-decks-client';
import { createNewDeck, Deck } from '../../models/deck';
import { useCardsClient } from '../../hooks/api/use-cards-client';
import { LoadingPage } from '../../components/loading-page/loading-page';
import { useState } from 'react';
import { Fade } from '../../animations/fade';
import { paths } from '../../routes';
import { PageHeader } from '../../components/page-header/page-header';
import { Button } from '../../components/button/button';
import { noop } from '../../helpers/func';
import { BubbleDivider } from '../../components/bubble-divider/bubble-divider';
import { FlashcardSet } from '../../components/flashcard-set/flashcard-set';

export const ViewDeckPage = () => {
  const [deck, setDeck] = useState<Deck | undefined>(undefined);
  const { deckId } = useParams(); // via the param :deckId
  const navigate = useNavigate();
  const { getDeckById } = useDecksClient();
  const { getCardsByDeckId } = useCardsClient();

  const isNewDeck = location.pathname === paths.createDeck;

  useEffect(() => {
    if (isNewDeck) {
      setDeck(createNewDeck());
    } else {
      fetchDeckAndRefresh();
    }
  }, [location]);

  if (deck === undefined) {
    return <LoadingPage label="loading deck..." />;
  }

  return (
    <Fade className="view-deck-page">
      <div className="view-deck-header">
        <PageHeader label={deck.metaData.title} onGoBackClick={navigateBackToDecks} />
        <div>
          <Button onClick={noop} size="medium">
            study
          </Button>
          <Button onClick={() => navigate(`${paths.editDeck}\\${deckId}`)} size="medium">
            edit
          </Button>
        </div>
      </div>
      <p className="view-deck-deck-description">{deck.metaData.desc}</p>
      <div>{`${deck.cards.length} cards`}</div>
      <div>{`created ${getFormattedDate(deck.metaData.dateCreated)}`}</div>

      <BubbleDivider label="cards" className="view-deck-divider" />
      <FlashcardSet cards={deck.cards} />
    </Fade>
  );

  async function fetchDeckAndRefresh() {
    if (deckId === undefined) {
      throw new Error('deckId cannot be undefined'); // Todo: maybe route to a 404 page??
    }
    const deck = await getDeckById(deckId);
    deck.cards = await getCardsByDeckId(deckId);
    setDeck(deck);
  }

  function navigateBackToDecks() {
    navigate(paths.decks);
  }

  function getFormattedDate(date: Date) {
    const year = date.getFullYear();

    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
  }
};
