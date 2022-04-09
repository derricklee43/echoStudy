import './deck-editor.scss';
import React, { useState } from 'react';
import { Deck } from '../../models/deck';
import { MetaDataEditor } from './meta-data-editor/meta-data-editor';
import { Card, createNewCard } from '../../models/card';
import { FlashcardSet } from '../../components/flashcard-set/flashcard-set';
import { Button } from '../../components/button/button';
import { PlusIcon } from '../../assets/icons/plus-icon/plus-icon';
import { PageHeader } from '../../components/page-header/page-header';
import { testJapaneseVerbsDeck } from '../../models/mock/deck.mock';
import { getTestFoxCard, getTestMonkeyCard, getTestMouseCard } from '../../models/mock/card.mock';
import { AnimatePresence } from 'framer-motion';
import { Fade } from '../../animations/fade';
import { v4 as uuidv4 } from 'uuid';

const testDeck = testJapaneseVerbsDeck(0);
testDeck.cards = [getTestMonkeyCard(), getTestFoxCard(), getTestMouseCard()];

interface DeckEditorPageProps {
  label?: string;
  deckId: number;
  onGoBackClick: (event: React.MouseEvent) => void;
}

export const DeckEditorPage = ({
  label = 'edit a deck',
  deckId,
  onGoBackClick,
}: DeckEditorPageProps) => {
  const [savedDeck, setSavedDeck] = useState(testDeck);
  const [unsavedDeck, setUnsavedDeck] = useState(testDeck);
  const isDeckSaved = savedDeck === unsavedDeck;

  return (
    <div className="deck-editor">
      <div className="deck-editor-header">
        <PageHeader label={label} onGoBackClick={onGoBackClick} />
        {getSaveButtonAndLabel()}
      </div>
      <MetaDataEditor
        deck={unsavedDeck}
        onDeckChange={handleDeckChange}
        onDeleteClick={handleDeleteDeckClick}
      />
      {unsavedDeck.cards.length > 0 ? getFlashcardSet() : getFlashcardSetPlaceholder()}
      <Button onClick={handleAddCardClick} size="medium" className="add-card-button">
        <PlusIcon />
        <label>new card</label>
      </Button>
    </div>
  );

  function getSaveButtonAndLabel() {
    return (
      <div>
        <AnimatePresence>
          {!isDeckSaved && (
            <Fade>
              <Button
                variant="invisible"
                onClick={handleDiscardChangesClick}
                className={`discard-changes-button`}
              >
                discard changes
              </Button>
            </Fade>
          )}
        </AnimatePresence>

        <Button onClick={handleSaveClick} size="medium">
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
        cards={unsavedDeck.cards}
        className="deck-editor-flashcard-set"
        onCardsChange={(cards: Card[]) => handleDeckChange({ ...unsavedDeck, cards })}
      />
    );
  }

  function handleAddCardClick() {
    const card = createNewCard(unsavedDeck.frontLang, unsavedDeck.backLang);
    handleDeckChange({ ...unsavedDeck, cards: [card, ...unsavedDeck.cards] });
  }

  function handleDeckChange(newDeck: Deck) {
    setUnsavedDeck(newDeck);
  }

  function handleSaveClick() {
    setSavedDeck(unsavedDeck);
  }

  function handleDiscardChangesClick() {
    setUnsavedDeck(savedDeck);
  }

  function handleDeleteDeckClick(event: React.MouseEvent) {
    onGoBackClick(event);
  }
};
