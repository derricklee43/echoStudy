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
  const [isActive, setIsActive] = useState(false);
  const [selectedChoice, setSelectedOption] = useState(getOptions()[0]);
  const [cards, setCards] = useState([card1, card2, card3]);
  const [activeCard, setActiveCard] = useState(-1);
  return (
    <div className="App">
      <div className="search-bar">
        <SearchBar
          placeholder="search my decks"
          onChange={() => console.log('changed')}
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

      <div className="flashcards-container">
        <Flashcard card={readonlyCard} variant={'readonly'} />
        <Reorder.Group axis="y" values={cards} onReorder={setCards}>
          {getFlashcards()}
        </Reorder.Group>
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
