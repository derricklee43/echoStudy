import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeckCover } from '../../components/deck-cover/deck-cover';
import { DropDownOption } from '../../components/drop-down-options/drop-down-options';
import { DropDown } from '../../components/drop-down/drop-down';
import { noop } from '../../helpers/func';
import { Deck } from '../../models/deck';
import {
  testEnglishDeck,
  testJapaneseVerbsDeck,
  testNPTEPartNumberDeck,
} from '../../models/mock/deck.mock';
import './flashcard-decks.scss';

// (+ add new deck) and (all decks)
const addNewDeckEntity: Deck = {
  id: -1,
  title: '+ add new deck',
  desc: '',
  access: 'Private',
  frontLang: 'English',
  backLang: 'English',
  cards: [],
};
let id = 0;
const decks = [
  testEnglishDeck(id++),
  testJapaneseVerbsDeck(id++),
  testNPTEPartNumberDeck(id++, 1),
  testNPTEPartNumberDeck(id++, 2),
  testNPTEPartNumberDeck(id++, 3),
];

// sort deck rules
const sortRules = ['sequential', 'last created', 'random'];
const sortRuleOptions = sortRules.map((item): DropDownOption => ({ id: item, value: item }));

export const FlashcardDecksPage = () => {
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState(sortRules[1]);

  return (
    <div className="pg-flashcard-decks">
      <div className="decks-page-header">
        <label>flashcard decks</label>
        <DropDown
          variant="dark"
          options={sortRuleOptions}
          label="sort by"
          buttonLabel={sortOption}
          onOptionSelect={(option: DropDownOption) => setSortOption(option.value as string)}
        />
      </div>
      <div className="deck-tile-container">
        <DeckCover
          flippable={false}
          onClick={onAddDeckClicked}
          deck={addNewDeckEntity}
          onStudyClick={noop}
          onEditClick={noop}
        />
        {getDeckCovers()}
      </div>
      <div className="footer-page-number">
        {/* no functionality, just text :P */}
        <label>page 1 of 1</label>
      </div>
    </div>
  );

  function getDeckCovers() {
    return decks.map((deck) => (
      <DeckCover key={deck.id} deck={deck} onStudyClick={noop} onEditClick={noop} />
    ));
  }

  function onAddDeckClicked() {
    // todo: maybe different route without any params (:deckId) since there is no 'deck' yet
    navigate('/deck-editor/0');
  }
};
