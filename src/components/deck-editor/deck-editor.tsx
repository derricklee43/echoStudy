import './deck-editor.scss';
import React, { useState } from 'react';
import { Deck } from '../../models/deck';
import { MetaDataEditor } from './meta-data-editor/meta-data-editor';
import { Card } from '../../models/card';
import { FlashcardSet } from '../flashcard-set/flashcard-set';
import { Button } from '../button/button';
import { CardContent } from '../../models/card-content';

interface DeckEditorProps {
  initialDeck: Deck;
  label?: string;
  onLeaveClick: () => void; // Just for the demo, we will remove later
  onDeckChange: (deck: Deck) => void;
}

export const DeckEditor = ({
  initialDeck,
  label = 'edit a deck',
  onLeaveClick, // Just for the demo, we will remove later
  onDeckChange,
}: DeckEditorProps) => {
  const [newDeck, setNewDeck] = useState(initialDeck);
  const [idCount, setIdCount] = useState(0);
  return (
    <>
      <div className="deck-editor">
        <MetaDataEditor label={label} deck={newDeck} onDeckChange={setNewDeck} />
        {newDeck.cards.length > 0 ? getFlashcardSet() : getFlashcardSetPlaceholder()}
        {getButtonFooter()}
      </div>
    </>
  );

  function getFlashcardSetPlaceholder() {
    return (
      <div className="flashcard-set-placeholder">
        <label>{'you currently have no cards. click "add card" to get started'}</label>
      </div>
    );
  }

  function getFlashcardSet() {
    return (
      <FlashcardSet
        cards={newDeck.cards}
        className="deck-editor-flashcard-set"
        onCardsChange={handleCardsChange}
      />
    );
  }

  function getButtonFooter() {
    return (
      <>
        <Button onClick={handleAddCardClick} className="editor-button editor-sticky-bottom">
          add card
        </Button>
        <div className="right-footer-buttons editor-sticky-bottom">
          <Button onClick={handleCancelClick} className="editor-button">
            cancel
          </Button>
          <Button onClick={handleSaveClick} className="editor-button">
            save
          </Button>
        </div>
      </>
    );
  }

  function handleCardsChange(cards: Card[]) {
    setNewDeck({ ...newDeck, cards });
  }

  function handleAddCardClick() {
    // Todo: add card
    const front: CardContent = {
      text: '',
      audio: new Audio(),
      language: newDeck.frontLang,
    };

    const back: CardContent = {
      text: '',
      audio: new Audio(),
      language: newDeck.frontLang,
    };

    const card: Card = { id: generateId(), front, back };
    const cards = [...newDeck.cards, card];

    setNewDeck({ ...newDeck, cards });
  }

  // Todo: find a better way to generate number id's for cards
  // maybe switch to a string and use uuid library
  function generateId() {
    let id = idCount;
    while (newDeck.cards.find((card: Card) => card.id === id)) {
      id++;
    }
    setIdCount(id + 1);
    return id;
  }

  function handleCancelClick() {
    console.log('here');
    onLeaveClick();
  }

  function handleSaveClick() {
    console.log('here');
    onDeckChange(newDeck);
    onLeaveClick();
  }
};
