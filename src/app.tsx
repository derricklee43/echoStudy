import React from 'react';
import './app.scss';
import { useState } from 'react';
import { DeckEditorPage } from './pages/deck-editor/deck-editor';
import { Sidebar } from './components/sidebar/sidebar';
import { Header } from './components/header/header';
import { FlashcardDecksPage } from './pages/decks/flashcard-decks';
import {
  testEnglishDeck,
  testJapaneseVerbsDeck,
  testNPTEPartNumberDeck,
} from './models/mock/deck.mock';
import { noop } from './helpers/func';

const testDecks = [testEnglishDeck(0), testJapaneseVerbsDeck(1), testNPTEPartNumberDeck(2, 1)];

function App() {
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
            <DeckEditorPage
              label="edit a deck"
              deckId={0}
              onGoBackClick={() => setShowDecks(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
