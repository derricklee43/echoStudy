import React from 'react';
import './App.scss';
import { useState } from 'react';
import { DeckCover } from './components/DeckCover/DeckCover';

const testDeck = {
  title: 'English 101',
  summary:
    'The course concentrates primarily on expository, effective composing, revising, and editing strategies.',
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
    </div>
  );
}

function dummy() {
  console.log('hello world');
}

export default App;
