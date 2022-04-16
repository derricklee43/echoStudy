import './deck-editor.scss';
import React from 'react';
import { MetaDataEditor } from './meta-data-editor/meta-data-editor';
import { FlashcardSet } from '../../../components/flashcard-set/flashcard-set';
import { Button } from '../../../components/button/button';
import { PlusIcon } from '../../../assets/icons/plus-icon/plus-icon';
import { PageHeader } from '../../../components/page-header/page-header';
import { AnimatePresence } from 'framer-motion';
import { Fade } from '../../../animations/fade';
import { usePrompt } from '../../../hooks/use-prompt';
import { useDeckEditor } from '../../../hooks/use-deck-editor';
import { Deck } from '../../../models/deck';
import { useEffect } from 'react';
import { useState } from 'react';
import { createNewCard } from '../../../models/card';

interface DeckEditorProps {
  initialDeck: Deck;
  isNewDeck: boolean;
  onGoBackClick: (event: React.MouseEvent) => void;
  onDeleteDeckClick: (event: React.MouseEvent) => void;
  onCreateDeckClick: (deck: Deck) => void;
}

export const DeckEditor = ({
  initialDeck,
  isNewDeck,
  onCreateDeckClick,
  onGoBackClick,
  onDeleteDeckClick,
}: DeckEditorProps) => {
  const {
    deck,
    hasUnsavedChanges,
    updateCard,
    updateMetaData,
    addCard,
    deleteCard,
    save,
    discardChanges,
    reorderCards,
    setDeck,
  } = useDeckEditor(initialDeck); // get real deck and update tests
  const [activeCardKey, setActiveCardKey] = useState('');
  usePrompt('Changes you made may not be saved.', hasUnsavedChanges); // prevent navigation if there are unsaved changes

  useEffect(() => {
    setDeck(initialDeck);
  }, [initialDeck]);

  return (
    <div className="deck-editor">
      <div className="deck-editor-header">
        <PageHeader label={isNewDeck ? 'create deck' : 'edit deck'} onGoBackClick={onGoBackClick} />
        {getSaveButtonAndLabel()}
      </div>
      <MetaDataEditor
        deckMetaData={deck.metaData}
        onDeckMetaDataChange={updateMetaData}
        onDeleteClick={onDeleteDeckClick}
      />
      {deck.cards.length > 0 ? getFlashcardSet() : getFlashcardSetPlaceholder()}
      <Button onClick={handleAddClick} size="medium" className="add-card-button">
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

        <Button onClick={handleSubmitClick} size="medium">
          {isNewDeck ? 'create' : 'save'}
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
        initialActiveCardKey={activeCardKey}
        onCardReorder={reorderCards}
        onCardChange={updateCard}
        onDeleteCardClick={deleteCard}
      />
    );
  }

  function handleAddClick() {
    const newCard = createNewCard();
    setActiveCardKey(newCard.key);
    addCard(newCard);
  }

  function handleSubmitClick() {
    if (isNewDeck) {
      // Todo: await response and handle error
      onCreateDeckClick(deck);
    } else {
      // Todo: await response and handle error
      save();
    }
  }
};
