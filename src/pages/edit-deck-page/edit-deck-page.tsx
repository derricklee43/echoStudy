import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fade } from '@/animations/fade';
import { LoadingPage } from '@/components/loading-page/loading-page';
import { isDefined } from '@/helpers/validator';
import { useCardsClient } from '@/hooks/api/use-cards-client';
import { useDecksClient } from '@/hooks/api/use-decks-client';
import { Deck } from '@/models/deck';
import { paths } from '@/routing/paths';
import { DeckEditor } from './deck-editor/deck-editor';
import './edit-deck-page.scss';

interface EditDeckPageProps {
  deck: Deck;
}

export const EditDeckPage = ({ deck }: EditDeckPageProps) => {
  const navigate = useNavigate();
  const { deleteDeckById, addDeck } = useDecksClient();
  const { addCards } = useCardsClient();

  // when this is not undefined, show a loading animation for long-running operations
  const [loadingLabel, setLoadingLabel] = useState<string | undefined>();

  const isNewDeck = location.pathname === paths.createDeck;
  if (isDefined(loadingLabel)) {
    return (
      <Fade className="edit-deck-page">
        <LoadingPage label={loadingLabel} labelDelay={1.0} />;
      </Fade>
    );
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

  async function handleCreateDeckClick(deck: Deck) {
    return _withLoadingUntilResolved('Creating your new deck...', async () => {
      const newDeckId = await addDeck(deck);
      await addCards(deck.cards, newDeckId);
      navigateToViewDeck(newDeckId);
    });
  }

  async function handleDeleteDeckClick() {
    return _withLoadingUntilResolved('Deleting this deck...', async () => {
      if (!isNewDeck && deck !== undefined) {
        await deleteDeckById(deck.metaData.id);
      }
      navigateBackToDecks();
    });
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

  async function _withLoadingUntilResolved(
    loadingLabel: string,
    promiseFn: (() => Promise<unknown>) | (() => unknown)
  ) {
    try {
      setLoadingLabel(loadingLabel);
      await promiseFn();
    } finally {
      setLoadingLabel(undefined);
    }
  }
};
