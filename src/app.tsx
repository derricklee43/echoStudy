import React from 'react';
import './app.scss';
import { useState } from 'react';
import { DeckCover } from './components/deck-cover/deck-cover';
import { Button } from './components/button/button';
import { Deck } from './models/deck';
import { SearchBar } from './components/search-bar/search-bar';
import { DropDown, DropDownOption } from './components/drop-down/drop-down';

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
  const [selectedChoice, setSelectedOption] = useState(getOptions()[0]);
  return (
    <div className="App">
      <div className="search-bar">
        <SearchBar
          placeholder="search my decks"
          onChange={() => console.log('changed')}
          debounceMs={500}
          onDebouncedChange={(value: string) => console.log('debounce-changed: ' + value)}
          onEnterPressed={(value: string) => console.log('enter pressed: ' + value)}
        />
      </div>
      <DeckCover
        isActive={isActive}
        onClick={() => setIsActive(!isActive)}
        deck={testDeck}
        onEditClick={dummy}
        onStudyClick={dummy}
      />
      <div className="improvised-popup">
        <DropDown
          variant="light"
          className="test-drop-down"
          label="hello"
          options={getOptions()}
          buttonLabel={selectedChoice.value}
          onOptionSelect={(choice) => {
            setSelectedOption(choice);
          }}
        />
        <Button variant="light" onClick={dummy}>
          World
        </Button>
      </div>

      <DropDown
        variant="dark"
        buttonLabel={selectedChoice.value}
        options={getOptions()}
        onOptionSelect={(choice) => setSelectedOption(choice)}
      />
      <Button variant="dark" onClick={dummy}>
        Hello
      </Button>
    </div>
  );
}

function getOptions(): DropDownOption[] {
  const options = ['hello world', 'jsdflkahsdf;lasdkjfas;dlfkjasd;flkajsdf;laksdjfl;ks', 'c', 'd'];
  return options.map((option) => ({ id: option, value: option }));
}

function dummy() {
  console.log('hello world');
}

export default App;
