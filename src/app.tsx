import React from 'react';
import './app.scss';
import { useState } from 'react';
import { Deck } from './models/deck';
import { Card } from './models/card';
import { DeckEditor } from './components/deck-editor/deck-editor';
import { Sidebar } from './components/sidebar/sidebar';
import { Header } from './components/header/header';
import { FlashcardDecksPage } from './pages/decks/flashcard-decks';

const card1: Card = {
  front: {
    language: 'English',
    audio: new Audio('https://weblio.hs.llnwd.net/e7/img/dict/kenej/audio/S-C3906E2_E-C392F5C.mp3'),
    text: 'fox',
  },
  back: {
    language: 'Japanese',
    audio: new Audio('https://0.tqn.com/z/g/japanese/library/media/audio/kitsune.wav'),
    text: '狐',
  },
  id: 1,
};

const card2: Card = {
  front: {
    language: 'English',
    audio: new Audio('https://weblio.hs.llnwd.net/e7/img/dict/kenej/audio/S-CBE8B66_E-CBEB33E.mp3'),
    text: 'mouse',
  },
  back: {
    language: 'Japanese',
    audio: new Audio('https://0.tqn.com/z/g/japanese/library/media/audio/nezumi.wav'),
    text: 'ネズミ',
  },
  id: 2,
};

const card3: Card = {
  front: {
    language: 'English',
    audio: new Audio('https://weblio.hs.llnwd.net/e7/img/dict/kenej/audio/S-A92E9A0_E-A9307A8.mp3'),
    text: 'monkey',
  },
  back: {
    language: 'Japanese',
    audio: new Audio('https://0.tqn.com/z/g/japanese/library/media/audio/saru.wav'),
    text: '猿',
  },
  id: 3,
};

const testDeck: Deck = {
  id: 0,
  title: 'Japanese 101',
  desc: 'The goal of this deck is to teach basic Japanese nouns, starting with animals.',
  access: 'Private',
  frontLang: 'English',
  backLang: 'Japanese',
  cards: [card1, card2, card3],
};

function App() {
  const [deck, setDeck] = useState(testDeck);
  const [showDecks, setShowDecks] = useState(true);

  return (
    <div className="App">
      <Header />
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
              initialDeck={deck}
              onDeckChange={setDeck}
              onLeaveClick={() => setShowDecks(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
