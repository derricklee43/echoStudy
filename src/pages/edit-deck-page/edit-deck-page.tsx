import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { DeckEditor } from './deck-editor/deck-editor';
import { Fade } from '../../animations/fade';
import { LoadingPage } from '../../components/loading-page/loading-page';
import { useCardsClient } from '../../hooks/api/use-cards-client';
import { useDecksClient } from '../../hooks/api/use-decks-client';
import { createNewDeck, Deck } from '../../models/deck';
import { paths } from '../../routes';
import './edit-deck-page.scss';

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
  }, [location, deckId]);

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
        onGoBackClick={handleGoBackClick}
      />
    </Fade>
  );

  async function fetchDeckAndRefresh() {
    setDeck(undefined);
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
    navigateToViewDeck(newDeckId);
  }

  async function handleDeleteDeckClick() {
    if (!isNewDeck && deck !== undefined) {
      await deleteDeckById(deck.metaData.id);
    }
    navigateBackToDecks();
  }

  function handleGoBackClick() {
    !isNewDeck && deck !== undefined
      ? navigateToViewDeck(deck?.metaData.id)
      : navigateBackToDecks();
  }

  function navigateBackToDecks() {
    navigate(paths.decks);
  }

  function navigateToViewDeck(id: number) {
    navigate(`${paths.deck}/${id}`);
  }
};
