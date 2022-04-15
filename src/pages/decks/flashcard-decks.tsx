import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeckCover } from '../../components/deck-cover/deck-cover';
import { DropDownOption } from '../../components/drop-down-options/drop-down-options';
import { DropDown } from '../../components/drop-down/drop-down';
import { noop } from '../../helpers/func';
import { useDecksClient } from '../../hooks/api/use-decks-client';
import { useFetchWrapper } from '../../hooks/api/use-fetch-wrapper';
import { createNewDeck, Deck } from '../../models/deck';
import {
  testEnglishDeck,
  testJapaneseVerbsDeck,
  testNPTEPartNumberDeck,
} from '../../models/mock/deck.mock';
import './flashcard-decks.scss';

// (+ add new deck) and (all decks)
const addNewDeckEntity: Deck = createNewDeck();
addNewDeckEntity.metaData.title = '+ add new deck';

let id = 0;
const testDecks = [
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
  const decksClient = useDecksClient();

  const [decks, setDecks] = useState(testDecks);
  const [sortOption, setSortOption] = useState(sortRules[1]);

  // fetch flashcard decks on load
  useEffect(() => {
    fetchDecksAndRefresh();
  }, []);

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
      <DeckCover key={deck.metaData.id} deck={deck} onStudyClick={noop} onEditClick={noop} />
    ));
  }

  function onAddDeckClicked() {
    // todo: maybe different route without any params (:deckId) since there is no 'deck' yet
    navigate('/deck-editor/0');
  }

  async function fetchDecksAndRefresh() {
    // todo: should get deck by user id in the future
    const fetchedDecks = await decksClient.getAllDecks();
    setDecks(fetchedDecks);
  }
};
