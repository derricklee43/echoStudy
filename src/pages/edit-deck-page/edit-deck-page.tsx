import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DeckEditor } from './deck-editor/deck-editor';
import { Fade } from '../../animations/fade';
import { useCardsClient } from '../../hooks/api/use-cards-client';
import { useDecksClient } from '../../hooks/api/use-decks-client';
import { Deck } from '../../models/deck';
import { paths } from '../../routing/paths';
import './edit-deck-page.scss';

interface EditDeckPageProps {
  deck: Deck;
}

export const EditDeckPage = ({ deck }: EditDeckPageProps) => {
  const navigate = useNavigate();
  const { deleteDeckById, addDeck } = useDecksClient();
  const { addCards } = useCardsClient();

  const isNewDeck = location.pathname === paths.createDeck;

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
