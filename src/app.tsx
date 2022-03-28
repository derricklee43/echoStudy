import React from 'react';
import { Reorder } from 'framer-motion';
import './app.scss';
import { useState } from 'react';
import { DeckCover } from './components/deck-cover/deck-cover';
import { Button } from './components/button/button';
import { Deck } from './models/deck';
import { SearchBar } from './components/search-bar/search-bar';
import { DropDown, DropDownOption } from './components/drop-down/drop-down';
import { CardFace } from './components/flashcard/card-face/card-face';
import { Flashcard } from './components/flashcard/flashcard';
import { Card } from './models/card';
import { CardContent } from './models/card-content';

const testDeck: Deck = {
  id: 0,
  title: 'English 101',
  desc: 'The course concentrates primarily on expository, effective composing, revising, and editing strategies.',
  access: 'Private',
  frontLang: 'English',
  backLang: 'English',
  cards: [],
};

const startingCards: Card[] = [1, 2, 3].map((card, id) => {
  const front: CardContent = {
    language: 'English',
    audio: new Audio(),
    text: `front ${card}`,
  };
  const back: CardContent = {
    language: 'English',
    audio: new Audio(),
    text: `back ${card}`,
  };
  return { id: card, front, back };
});

function App() {
  const [isActive, setIsActive] = useState(false);
  const [selectedChoice, setSelectedOption] = useState(getOptions()[0]);
  const [cards, setCards] = useState(startingCards);
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
      <div className="flashcards-container">
        <Reorder.Group axis="y" values={cards} onReorder={setCards}>
          {getFlashcards()}
        </Reorder.Group>
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

  function getFlashcards() {
    console.log(cards);
    return cards.map((card, id) => {
      const index = id + 1;
      const value = (
        <Flashcard
          key={index}
          card={card}
          index={index}
          variant={activeCard === card.id ? 'active' : 'inactive'}
          onCardClick={() => setActiveCard(card.id)}
          // onFocus={() => setActiveCard(card.id)}
          onCardChange={(c) => handleCardChange(c, id)}
          onDownClick={() => handleDownClick(id)}
          onUpClick={() => handleUpClick(id)}
        />
      );
      return (
        <Reorder.Item key={card.id} value={card}>
          {value}
        </Reorder.Item>
      );
    });

    function handleUpClick(id: number) {
      const newCards = [...cards];
      newCards[id] = newCards.splice(id - 1, 1, cards[id])[0];
      setCards(newCards);
    }

    function handleDownClick(id: number) {
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
  const options = ['hello world', 'b', 'c', 'd'];
  return options.map((option) => ({ id: option, value: option }));
}

function dummy() {
  console.log('hello world');
}

export default App;
