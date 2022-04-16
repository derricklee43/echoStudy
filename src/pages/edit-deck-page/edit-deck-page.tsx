import './edit-deck-page.scss';
import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDecksClient } from '../../hooks/api/use-decks-client';
import { createNewDeck, Deck } from '../../models/deck';
import { useCardsClient } from '../../hooks/api/use-cards-client';
import { LoadingPage } from '../../components/loading-page/loading-page';
import { useState } from 'react';
import { DeckEditor } from './deck-editor/deck-editor';
import { Fade } from '../../animations/fade';
import { paths } from '../../routes';

export const EditDeckPage = () => {
  const [deck, setDeck] = useState<Deck | undefined>(undefined);
  const { deckId } = useParams(); // via the param :deckId
  const location = useLocation();
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
    <Fade className="edit-deck-page">
      <DeckEditor
        isNewDeck={false}
        initialDeck={deck}
        onCreateDeckClick={handleCreateDeckClick}
        onDeleteDeckClick={handleDeleteDeckClick}
        onGoBackClick={navigateBackToDecks}
      />
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

  function handleCreateDeckClick() {
    // Todo: create deck
    // Todo: navigate to view-deck page
    navigate('/decks');
  }

  function handleDeleteDeckClick() {
    // Todo: delete deck
    navigateBackToDecks();
  }

  function navigateBackToDecks() {
    navigate('/decks');
  }
};
