import './deck-editor.scss';
import React from 'react';
import { Deck } from '../../models/deck';
import { Flashcard } from '../flashcard/flashcard';
import { Button } from '../button/button';
import { TextBox } from '../text-box/text-box';
import { TextArea } from '../text-area/text-area';
import { BubbleDivider } from '../bubble-divider/bubble-divider';
import { DropDown } from '../drop-down/drop-down';
import { useState } from 'react';
import { MetaDataEditor } from './meta-data-editor/meta-data-editor';
import { Reorder } from 'framer-motion';
import { Card } from '../../models/card';

interface DeckEditorProps {
  deck: Deck;
  onDeckChange: (deck: Deck) => void;
}

export const DeckEditor = ({ deck, onDeckChange }: DeckEditorProps) => {
  const [activeCard, setActiveCard] = useState(-1);
  return (
    <div className="deck-editor">
      <MetaDataEditor deck={deck} onDeckChange={onDeckChange} />
      {getCards()}
    </div>
  );

  function getCards() {
    return deck.cards.map((card, index) => {
      return (
        <Flashcard
          key={index}
          card={card}
          index={index + 1}
          variant={activeCard === card.id ? 'active' : 'inactive'}
          onFocus={() => setActiveCard(card.id)}
          onCardChange={(c) => handleCardChange(c, index)}
          onDownClick={() => handleDownClick(index)}
          onUpClick={() => handleUpClick(index)}
          onRemoveClick={() => handleRemoveClick(index)}
        />
      );
    });
    //     <Reorder.Item key={card.id} value={card}>
    //     {value}
    //   </Reorder.Item>

    function handleRemoveClick(index: number) {
      // Todo deep copy
      const newCards = [...deck.cards];
      newCards.splice(index, 1);
      onDeckChange({ ...deck, cards: newCards });
    }

    function handleUpClick(index: number) {
      // Todo handle up click when card is first
      // Todo deep copy
      const newCards = [...deck.cards];
      newCards[index] = newCards.splice(index - 1, 1, deck.cards[index])[0];
      onDeckChange({ ...deck, cards: newCards });
    }

    function handleDownClick(index: number) {
      //Todo handle down click when card is last
      // Todo deep copy
      const newCards = [...deck.cards];
      newCards[index] = newCards.splice(index + 1, 1, deck.cards[index])[0];
      onDeckChange({ ...deck, cards: newCards });
    }

    function handleCardChange(newCard: Card, id: number) {
      // Todo deep copy
      const newCards = [...deck.cards];
      newCards[id] = newCard;
      onDeckChange({ ...deck, cards: newCards });
    }
  }
};
