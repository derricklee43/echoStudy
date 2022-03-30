import React from 'react';
import './app.scss';
import { useState } from 'react';
import { DeckCover } from './components/deck-cover/deck-cover';
import { Button } from './components/button/button';
import { Deck } from './models/deck';
import { SearchBar } from './components/search-bar/search-bar';
import { DropDown, DropDownOption } from './components/drop-down/drop-down';
import { TEST_OPTIONS_LARGE } from './components/drop-down/options.mock';
import { TextArea } from './components/text-area/text-area';
import { TextBox } from './components/text-box/text-box';
import { Sidebar } from './components/sidebar/sidebar';
import { Header } from './components/header/header';

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
  const [showDecks, setShowDecks] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [selectedChoice, setSelectedOption] = useState(getOptions()[0]);

  // (e.g.) read from textAreaContent when user submits a form
  const [textAreaContent, setTextAreaContent] = useState('');

  const [textBoxValue1, setTextBoxValue1] = useState('');
  const [textBoxValue2, setTextBoxValue2] = useState('');

  return (
    <div className="App">
      <Header />
      <Sidebar onFlashcardDecksClick={() => setShowDecks(true)} />
      <div className="page-wrap">
        <div className="content">
          <div className="text-areas">
            <TextArea
              placeholder="copy and paste your cards here"
              lines={8}
              label="a cool label"
              value={textAreaContent}
              onChange={(v: string) => setTextAreaContent(v)}
            />
            <TextArea
              lines={8}
              label="copy your cards"
              value="what is a gerund; what is a gerund; what is a gerund; what is a gerund;"
              readonly={true}
            />
          </div>
          <div className="text-box">
            <TextBox
              label="username"
              value={textBoxValue1}
              onChange={(v: string) => setTextBoxValue1(v)}
            />
          </div>
          <div className="text-box-dark">
            <TextBox
              label="username"
              variant="dark"
              value={textBoxValue2}
              onChange={(v: string) => setTextBoxValue2(v)}
            />
          </div>
          <div className="search-bar">
            <SearchBar
              placeholder="search my decks"
              onChange={() => console.log('changed')}
              debounceMs={500}
              onDebouncedChange={(value: string) => console.log('debounce-changed: ' + value)}
              onEnterPressed={(value: string) => console.log('enter pressed: ' + value)}
              dropDownData={TEST_OPTIONS_LARGE}
              onDropdownClick={(option: DropDownOption) => console.log(option)}
            />
          </div>
        </div>
      </div>
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
