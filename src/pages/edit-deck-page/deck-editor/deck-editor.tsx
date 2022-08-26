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
import { Card, createNewCard } from '../../../models/card';
import { UpToggle } from '../../../animations/up-toggle';
import { LoadingIcon } from '../../../assets/icons/loading-icon/loading-icon';

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
    isSaving,
    updateCard,
    updateMetaData,
    addCard,
    deleteCard,
    save,
    discardChanges,
    reorderCards,
    setDeck,
  } = useDeckEditor(initialDeck); // get real deck and update tests
  const [isPromptEnabled, setIsPromptEnabled] = useState(true);
  const [activeCardKey, setActiveCardKey] = useState('');

  const isSaveButtonDisabled = isSaving || !deck.metaData.title || !deck.metaData.desc;

  usePrompt('Changes you made may not be saved.', isPromptEnabled && hasUnsavedChanges); // prevent navigation if there are unsaved changes

  useEffect(() => {
    setDeck(initialDeck);
  }, [initialDeck]);

  return (
    <div className="deck-editor">
      <div className="deck-editor-header">
        <PageHeader
          label={isNewDeck ? 'create deck' : 'edit deck'}
          goBackLabel={isNewDeck ? 'back to decks' : 'back to deck'}
          onGoBackClick={onGoBackClick}
        />
        <div className="deck-editor-save-buttons">
          {getDiscardChangesButton()}
          <Button
            onClick={handleSubmitClick}
            className={isNewDeck ? '' : 'save-changes-button'}
            size="medium"
            disabled={isSaveButtonDisabled}
            variant="dark"
          >
            {isNewDeck ? 'create' : getSaveButtonToggle()}
          </Button>
        </div>
      </div>
      <MetaDataEditor
        deckMetaData={deck.metaData}
        onDeckMetaDataChange={updateMetaData}
        onDeleteClick={onDeleteDeckClick}
        onImportedCardsAdd={handleImportedCards}
      />
      {deck.cards.length > 0 ? getFlashcardSet() : getFlashcardSetPlaceholder()}
      <Button onClick={handleAddClick} size="medium" className="add-card-button">
        <PlusIcon />
        <label>new card</label>
      </Button>
    </div>
  );

  function getSaveButtonToggle() {
    return (
      <UpToggle
        className="save-changes-content-container"
        showDefault={!isSaving}
        defaultContent="save"
        alternateContent={
          <div className="save-changes-loading">
            <LoadingIcon />
            <label>saving</label>
          </div>
        }
      />
    );
  }

  function getDiscardChangesButton() {
    return (
      <AnimatePresence>
        {hasUnsavedChanges && !isSaving && (
          <Fade>
            <Button variant="invisible" onClick={discardChanges} className="discard-changes-button">
              discard changes
            </Button>
          </Fade>
        )}
      </AnimatePresence>
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

  function handleImportedCards(cards: Card[]) {
    cards.forEach((card) => addCard(card));
  }

  function handleAddClick() {
    const newCard = createNewCard();
    setActiveCardKey(newCard.key);
    addCard(newCard);
  }

  function handleSubmitClick() {
    if (isNewDeck) {
      setIsPromptEnabled(false);
      onCreateDeckClick(deck); // Todo: await and handle errors
    } else {
      save(); // Todo: await and handle errors
    }
  }
};
