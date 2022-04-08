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

interface DeckEditorPageProps {
  label?: string;
  deckId: number;
  onGoBackClick: (event: React.MouseEvent) => void;
}
const testDeck = testJapaneseVerbsDeck(0);
testDeck.cards = [getTestMonkeyCard(0), getTestFoxCard(1), getTestMouseCard(2)];

export const DeckEditorPage = ({
  label = 'edit a deck',
  deckId,
  onGoBackClick,
}: DeckEditorPageProps) => {
  const [savedDeck, setSavedDeck] = useState(testDeck);
  const [unsavedDeck, setUnsavedDeck] = useState(testDeck);
  const isDeckSaved = savedDeck === unsavedDeck;

  const [idCount, setIdCount] = useState(0);

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
      <Button onClick={handleAddCardClick} className="add-card-button editor-button">
        <PlusIcon />
        <label>new card</label>
      </Button>
    </div>
  );

  function getSaveButtonAndLabel() {
    const className = isDeckSaved ? '' : 'visible';
    return (
      <div>
        <Button
          variant="invisible"
          onClick={handleDiscardChangesClick}
          className={`discard-changes-button ${className}`}
        >
          discard changes
        </Button>
        <Button onClick={handleSaveClick} className="editor-button">
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
    card.id = generateId();

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

  // Todo: find a better way to generate number id's for cards
  // maybe switch to a string and use uuid library
  function generateId() {
    let id = idCount;
    while (testDeck.cards.find((card: Card) => card.id === id)) {
      id++;
    }
    setIdCount(id + 1);
    return id;
  }
};
