import './deck-editor.scss';
import React, { useEffect } from 'react';
import { MetaDataEditor } from './meta-data-editor/meta-data-editor';
import { FlashcardSet } from '../../components/flashcard-set/flashcard-set';
import { Button } from '../../components/button/button';
import { PlusIcon } from '../../assets/icons/plus-icon/plus-icon';
import { PageHeader } from '../../components/page-header/page-header';
import { testJapaneseVerbsDeck } from '../../models/mock/deck.mock';
import { getTestFoxCard, getTestMonkeyCard, getTestMouseCard } from '../../models/mock/card.mock';
import { AnimatePresence } from 'framer-motion';
import { Fade } from '../../animations/fade';
import { useNavigate, useParams } from 'react-router-dom';
import { usePrompt } from '../../hooks/use-prompt';
import { useDeckEditor } from '../../hooks/use-deck-editor';

const testDeck = testJapaneseVerbsDeck(0);
testDeck.cards = [getTestMonkeyCard(), getTestFoxCard(), getTestMouseCard()];

// used to test deck in deck-editor.test.tsx
const testEmptyDeck = testJapaneseVerbsDeck(0);

interface DeckEditorPageProps {
  label?: string;
}

export const DeckEditorPage = ({ label = 'edit a deck' }: DeckEditorPageProps) => {
  const navigate = useNavigate();
  const { deckId } = useParams(); // via the param :deckId

  const [
    { deck, hasUnsavedChanges },
    { updateCard, updateMetaData, addCard, deleteCard, save, discardChanges, reorderCards },
  ] = useDeckEditor(deckId ? testDeck : testEmptyDeck); // get real deck and update tests

  // todo: delete this in a future PR, this is for debugging
  useEffect(() => {
    console.log(`navigated to DeckEditorPage with deckId: ${deckId}`);
  }, [deckId]);

  // prevent navigation if there are unsaved changes
  usePrompt('Changes you made may not be saved.', hasUnsavedChanges);

  return (
    <div className="deck-editor">
      <div className="deck-editor-header">
        <PageHeader label={label} onGoBackClick={navigateBackToDecks} />
        {getSaveButtonAndLabel()}
      </div>
      <MetaDataEditor
        deckMetaData={deck.metaData}
        onDeckMetaDataChange={updateMetaData}
        onDeleteClick={handleDeleteDeckClick}
      />
      {deck.cards.length > 0 ? getFlashcardSet() : getFlashcardSetPlaceholder()}
      <Button onClick={addCard} size="medium" className="add-card-button">
        <PlusIcon />
        <label>new card</label>
      </Button>
    </div>
  );

  function getSaveButtonAndLabel() {
    return (
      <div>
        <AnimatePresence>
          {hasUnsavedChanges && (
            <Fade>
              <Button
                variant="invisible"
                onClick={discardChanges}
                className={`discard-changes-button`}
              >
                discard changes
              </Button>
            </Fade>
          )}
        </AnimatePresence>

        <Button onClick={save} size="medium">
          save
        </Button>
      </div>
    );
  }

  function getFlashcardSetPlaceholder() {
    return (
      <div className="flashcard-set-placeholder">
        <label>{'you currently have no cards. click "+ new card" to get started'}</label>
      </div>
    );
  }

  function getFlashcardSet() {
    return (
      <FlashcardSet
        cards={deck.cards}
        className="deck-editor-flashcard-set"
        onCardReorder={reorderCards}
        onCardChange={updateCard}
        onDeleteCardClick={deleteCard}
      />
    );
  }

  function handleDeleteDeckClick() {
    navigateBackToDecks();
  }

  function navigateBackToDecks() {
    navigate('/decks');
  }
};
