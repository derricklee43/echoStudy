import './deck-editor.scss';
import React, { useState } from 'react';
import { Deck } from '../../models/deck';
import { MetaDataEditor } from './meta-data-editor/meta-data-editor';
import { Card, createNewCard } from '../../models/card';
import { FlashcardSet } from '../../components/flashcard-set/flashcard-set';
import { Button } from '../../components/button/button';
import { PlusIcon } from '../../assets/icons/plus-icon/plus-icon';
import { PageHeader } from '../../components/page-header/page-header';

interface DeckEditorProps {
  deck: Deck;
  label?: string;
  isDeckSaved: boolean;
  onGoBackClick: (event: React.MouseEvent) => void;
  onDeckChange: (deck: Deck) => void;
  onDeleteClick: (event: React.MouseEvent) => void;
  onDiscardChangesClick: (event: React.MouseEvent) => void;
  onSaveClick: (event: React.MouseEvent) => void;
}

export const DeckEditor = ({
  deck,
  label = 'edit a deck',
  isDeckSaved,
  onGoBackClick,
  onDeckChange,
  onDeleteClick,
  onSaveClick,
  onDiscardChangesClick,
}: DeckEditorProps) => {
  const [idCount, setIdCount] = useState(0);

  return (
    <div className="deck-editor">
      <div className="deck-editor-header">
        <PageHeader label={label} onGoBackClick={onGoBackClick} />
        {getSaveButtonAndLabel()}
      </div>
      <MetaDataEditor deck={deck} onDeckChange={onDeckChange} onDeleteClick={onDeleteClick} />
      {deck.cards.length > 0 ? getFlashcardSet() : getFlashcardSetPlaceholder()}
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
          onClick={onDiscardChangesClick}
          className={`discard-changes-button editor-button ${className}`}
        >
          discard changes
        </Button>
        <Button onClick={onSaveClick} className="editor-button">
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
        onCardsChange={(cards: Card[]) => onDeckChange({ ...deck, cards })}
      />
    );
  }

  function handleAddCardClick() {
    const card = createNewCard(deck.frontLang, deck.backLang);
    card.id = generateId();

    onDeckChange({ ...deck, cards: [card, ...deck.cards] });
  }

  // Todo: find a better way to generate number id's for cards
  // maybe switch to a string and use uuid library
  function generateId() {
    let id = idCount;
    while (deck.cards.find((card: Card) => card.id === id)) {
      id++;
    }
    setIdCount(id + 1);
    return id;
  }
};
