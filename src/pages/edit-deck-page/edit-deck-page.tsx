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
  const { getDeckById, deleteDeckById, addDeck } = useDecksClient();
  const { getCardsByDeckId } = useCardsClient();
  const { addCards } = useCardsClient();

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
        isNewDeck={isNewDeck}
        initialDeck={deck}
        onCreateDeckClick={handleCreateDeckClick}
        onDeleteDeckClick={handleDeleteDeckClick}
        onGoBackClick={navigateBackToDecks}
      />
    </Fade>
  );

  async function fetchDeckAndRefresh() {
    if (deckId === undefined) {
      throw new Error('deckId cannot be undefined');
    }
    const deck = await getDeckById(deckId);
    deck.cards = await getCardsByDeckId(deckId);
    setDeck(deck);
  }

  async function handleCreateDeckClick(deck: Deck) {
    const newDeckId = await addDeck(deck);
    await addCards(deck.cards, newDeckId);
    navigate(`${paths.deck}/${newDeckId}`);
  }

  async function handleDeleteDeckClick() {
    if (!isNewDeck && deck !== undefined) {
      await deleteDeckById(deck.metaData.id);
    }
    navigateBackToDecks();
  }

  function navigateBackToDecks() {
    navigate(paths.decks);
  }
};
