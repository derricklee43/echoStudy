import React from 'react';
import './app.scss';
import { useState } from 'react';
import { DeckCover } from './components/deck-cover/deck-cover';
import { Button } from './components/button/button';
import { Deck } from './models/deck';

const testDeck: Deck = {
  id: 0,
  title: 'English 101',
  desc: 'The course concentrates primarily on expository, effective composing, revising, and editing strategies.',
  access: 'Private',
  frontLang: 'English',
  backLang: 'English',
  cards: [],
};

function App() {
  const [isActive, setIsActive] = useState(false);
  return (
    <div className="App">
      <DeckCover
        isActive={isActive}
        onClick={() => setIsActive(!isActive)}
        deck={testDeck}
        onEditClick={dummy}
        onStudyClick={dummy}
      />
      <div>
        <Button variant="dark" onClick={dummy}>
          Hello
        </Button>
        <Button variant="light" onClick={dummy}>
          World
        </Button>
      </div>
    </div>
  );
}

function dummy() {
  console.log('hello world');
}

export default App;
