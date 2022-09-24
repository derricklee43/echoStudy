import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { DeckCover } from '../../components/deck-cover/deck-cover';
import { DropDown } from '../../components/drop-down/drop-down';
import { noop } from '../../helpers/func';
import { useDecksClient } from '../../hooks/api/use-decks-client';
import { createNewDeck, Deck } from '../../models/deck';
import { paths } from '../../routing/paths';
import {
  AllSortRules,
  userDecksSortedState,
  userDecksSortRuleState,
  userDecksState,
} from '../../state/user-decks';
import './flashcard-decks.scss';

// (+ add new deck) and (all decks)
const addNewDeckEntity: Deck = createNewDeck();
addNewDeckEntity.metaData.title = '+ add new deck';

export const FlashcardDecksPage = () => {
  const navigate = useNavigate();
  const decksClient = useDecksClient();

  const setUserDecks = useSetRecoilState(userDecksState); // global user decks

  // sort rule & the deck with the sort rule applied
  const [sortOption, setSortOption] = useRecoilState(userDecksSortRuleState);
  const sortedDecks = useRecoilValue(userDecksSortedState);

  // fetch flashcard decks on load
  useEffect(() => {
    fetchDecksAndRefresh();
  }, []);

  return (
    <div className="pg-flashcard-decks">
      <div className="decks-page-header">
        <label>flashcard decks</label>
        <DropDown
          className="align-right"
          variant="dark"
          options={AllSortRules.map((item) => ({ id: item, value: item, focusable: true }))}
          label="sort by"
          buttonLabel={sortOption}
          onOptionSelect={(option) => setSortOption(option.id)}
        />
      </div>
      <div className="deck-tile-container">
        <DeckCover
          flippable={false}
          onClick={onAddDeckClicked}
          deck={addNewDeckEntity}
          onStudyClick={noop}
          onViewClick={noop}
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
    return sortedDecks.map((deck) => (
      <DeckCover
        key={deck.metaData.id}
        deck={deck}
        onStudyClick={() => handleStudyClick(deck.metaData.id)}
        onViewClick={() => handleViewClick(deck.metaData.id)}
      />
    ));
  }

  function handleViewClick(id: number) {
    navigate(`${paths.deck}/${id}`);
  }

  function handleStudyClick(id: number) {
    navigate(`${paths.study}/${id}`);
  }

  function onAddDeckClicked() {
    navigate(paths.createDeck);
  }

  async function fetchDecksAndRefresh() {
    const fetchedDecks = await decksClient.getAllDecks();
    setUserDecks(fetchedDecks);
  }
};
