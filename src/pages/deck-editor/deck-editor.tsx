import './deck-editor.scss';
import React, { useEffect, useState } from 'react';
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
import { useNavigate, useNavigationType, useParams } from 'react-router-dom';
import { usePrompt } from '../../hooks/use-prompt';

const testDeck = testJapaneseVerbsDeck(0);
testDeck.cards = [getTestMonkeyCard(), getTestFoxCard(), getTestMouseCard()];

interface DeckEditorPageProps {
  label?: string;
}

export const DeckEditorPage = ({ label = 'edit a deck' }: DeckEditorPageProps) => {
  const navigate = useNavigate();
  const { deckId } = useParams(); // via the param :deckId

  // todo: delete this in a future PR, this is for debugging
  useEffect(() => {
    console.log(`navigated to DeckEditorPage with deckId: ${deckId}`);
  }, [deckId]);

  const [savedDeck, setSavedDeck] = useState(testDeck);
  const [unsavedDeck, setUnsavedDeck] = useState(testDeck);
  const isDeckSaved = savedDeck === unsavedDeck;

  // prevent navigation if there are unsaved changes
  usePrompt('Changes you made may not be saved.', !isDeckSaved);

  return (
    <div className="deck-editor">
      <div className="deck-editor-header">
        <PageHeader label={label} onGoBackClick={onGoBackClickHandler} />
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
    onGoBackClickHandler();
  }

  function onGoBackClickHandler() {
    // todo: discuss what 'go back' should actually do
    // can use navigate(-1) to go back a page, but this can have issues
    navigate('/');
  }
};
