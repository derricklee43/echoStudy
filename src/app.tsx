import React from 'react';
import './app.scss';
import { useState } from 'react';
import { DeckEditor } from './pages/deck-editor/deck-editor';
import { Sidebar } from './components/sidebar/sidebar';
import { Header } from './components/header/header';
import { FlashcardDecksPage } from './pages/decks/flashcard-decks';
import {
  testEnglishDeck,
  testJapaneseVerbsDeck,
  testNPTEPartNumberDeck,
} from './models/mock/deck.mock';
import { getTestFoxCard, getTestMonkeyCard, getTestMouseCard } from './models/mock/card.mock';
import { noop } from './helpers/func';

const testDecks = [testEnglishDeck(0), testJapaneseVerbsDeck(1), testNPTEPartNumberDeck(2, 1)];
testDecks[1].cards = [getTestMonkeyCard(0), getTestFoxCard(1), getTestMouseCard(2)];

function App() {
  const [savedDeck, setSavedDeck] = useState(testDecks[1]);
  const [unsavedDeck, setUnsavedDeck] = useState(testDecks[1]);
  const [showDecks, setShowDecks] = useState(true);

  return (
    <div className="App">
      <Header decks={testDecks} />
      <Sidebar
        onFlashcardDecksClick={() => setShowDecks(true)}
        onCreateClick={() => setShowDecks(false)}
      />
      <div className="page-wrap">
        <div className="content">
          {showDecks ? (
            <FlashcardDecksPage onAddDeckClicked={() => setShowDecks(false)} />
          ) : (
            <DeckEditor
              deck={unsavedDeck}
              onDeckChange={setUnsavedDeck}
              onGoBackClick={() => setShowDecks(true)}
              onDeleteClick={noop}
              onDiscardChangesClick={() => setUnsavedDeck(savedDeck)}
              onSaveClick={() => setSavedDeck(unsavedDeck)}
              isDeckSaved={savedDeck === unsavedDeck}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
