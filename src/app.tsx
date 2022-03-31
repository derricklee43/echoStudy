import React from 'react';
import { Reorder } from 'framer-motion';
import './app.scss';
import { useState } from 'react';
import { DeckCover } from './components/deck-cover/deck-cover';
import { Button } from './components/button/button';
import { Deck } from './models/deck';
import { SearchBar } from './components/search-bar/search-bar';
import { DropDown, DropDownOption } from './components/drop-down/drop-down';
import { Flashcard } from './components/flashcard/flashcard';
import { Card } from './models/card';
import { TEST_OPTIONS_LARGE } from './components/drop-down/options.mock';
import { TextArea } from './components/text-area/text-area';
import { TextBox } from './components/text-box/text-box';
import { Sidebar } from './components/sidebar/sidebar';
import { Header } from './components/header/header';

const testDeck: Deck = {
  id: 0,
  title: 'Japanese 101',
  desc: 'The goal of this deck is to teach basic Japanese nouns, starting with animals.',
  access: 'Private',
  frontLang: 'English',
  backLang: 'Japanese',
  cards: [],
};

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

const readonlyCard: Card = {
  front: {
    language: 'English',
    audio: new Audio('https://weblio.hs.llnwd.net/e7/img/dict/kenej/audio/S-A92E9A0_E-A9307A8.mp3'),
    text: 'Readonly Front',
  },
  back: {
    language: 'Japanese',
    audio: new Audio('https://0.tqn.com/z/g/japanese/library/media/audio/saru.wav'),
    text: 'Readonly Back',
  },
  id: 3,
};

function App() {
  const [showDecks, setShowDecks] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [selectedChoice, setSelectedOption] = useState(getOptions()[0]);
  const [cards, setCards] = useState([card1, card2, card3]);
  const [activeCard, setActiveCard] = useState(-1);

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

  function getFlashcards() {
    return cards.map((card, id) => {
      const index = id + 1;
      const value = (
        <Flashcard
          key={index}
          card={card}
          index={index}
          variant={activeCard === card.id ? 'active' : 'inactive'}
          onFocus={() => setActiveCard(card.id)}
          onCardChange={(c) => handleCardChange(c, id)}
          onDownClick={() => handleDownClick(id)}
          onUpClick={() => handleUpClick(id)}
          onRemoveClick={() => handleRemoveClick(id)}
        />
      );
      return (
        <Reorder.Item key={card.id} value={card}>
          {value}
        </Reorder.Item>
      );
    });

    function handleRemoveClick(id: number) {
      const newCards = [...cards];
      newCards.splice(id, 1);
      setCards(newCards);
    }

    function handleUpClick(id: number) {
      // Todo handle up click when card is first
      const newCards = [...cards];
      newCards[id] = newCards.splice(id - 1, 1, cards[id])[0];
      setCards(newCards);
    }

    function handleDownClick(id: number) {
      //Todo handle down click when card is last
      const newCards = [...cards];
      newCards[id] = newCards.splice(id + 1, 1, cards[id])[0];
      setCards(newCards);
    }

    function handleCardChange(newCard: Card, id: number) {
      const newCards = [...cards];
      newCards[id] = newCard;
      setCards(newCards);
    }
  }
}

function getOptions(): DropDownOption[] {
  const options = ['hello world', 'jsdflkahsdf;lasdkjfas;dlfkjasd;flkajsdf;laksdjfl;ks', 'c', 'd'];
  return options.map((option) => ({ id: option, value: option }));
}

function dummy() {
  console.log('hello world');
}

export default App;
