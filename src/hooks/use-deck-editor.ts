import { useReducer, useState } from 'react';
import { Card, filterBlankCards } from '@/models/card';
import { Deck, DeckMetaData } from '@/models/deck';
import { useCardsClient } from './api/use-cards-client';
import { useDecksClient } from './api/use-decks-client';

type CardMap = { [id: string]: Card };

interface DeckEditorReturn {
  deck: Deck;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  save: () => void;
  discardChanges: () => void;
  addCard: (card: Card) => void;
  deleteCard: (card: Card) => void;
  updateCard: (card: Card) => void;
  updateMetaData: (metaData: DeckMetaData) => void;
  reorderCards: (cards: Card[]) => void;
  setDeck: (newDeck: Deck) => void;
}

interface DeckReducerState {
  currentDeck: Deck;
  savedDeck: Deck;
  hasUnsavedChanges: boolean;
  addedCards: CardMap;
  deletedCards: CardMap;
  updatedCards: CardMap;
}

interface DeckReducerDispatch {
  type: DECK_REDUCER_TYPE;
  card?: Card;
  metaData?: DeckMetaData;
  cards?: Card[];
  newDeck?: Deck;
}

const enum DECK_REDUCER_TYPE {
  UPDATE_META_DATA = 'UPDATE_META_DATA',
  ADD_CARD = 'ADD_CARD',
  DELETE_CARD = 'DELETE_CARD',
  UPDATE_CARD = 'UPDATE_CARD',
  REORDER_CARDS = 'REORDER_CARDS',
  SET_DECK = 'SET_DECK',
}

export const useDeckEditor = (deck: Deck): DeckEditorReturn => {
  const [isSaving, setIsSaving] = useState(false);
  const [state, dispatch] = useReducer(deckEditorReducer, {
    currentDeck: deck,
    savedDeck: deck,
    hasUnsavedChanges: false,
    addedCards: {},
    updatedCards: {},
    deletedCards: {},
  });

  const decksClient = useDecksClient();
  const cardsClient = useCardsClient();

  async function save() {
    setIsSaving(true);
    try {
      const deckId = state.currentDeck.metaData.id;
      const addedCards = Object.values(state.addedCards).filter(filterBlankCards);
      const updatedCards = Object.values(state.updatedCards).filter(filterBlankCards);
      const deletedCards = Object.values(state.deletedCards);

      const promises = [
        decksClient.updateDeckById(state.currentDeck),
        ...[addedCards.length > 0 ? cardsClient.addCards(addedCards, deckId) : []],
        ...[updatedCards.length > 0 ? cardsClient.updateCards(updatedCards) : []],
        ...[deletedCards.length > 0 ? cardsClient.deleteCards(deletedCards) : []],
        // Todo: we need to send the reordered cards too
      ];
      await Promise.all(promises);
      dispatch({ type: DECK_REDUCER_TYPE.SET_DECK, newDeck: state.currentDeck });
    } catch (e) {
      console.error(e);
    }
    setIsSaving(false);
  }

  function discardChanges() {
    setDeck(state.savedDeck);
  }

  function updateMetaData(metaData: DeckMetaData) {
    dispatchIfSafe({ type: DECK_REDUCER_TYPE.UPDATE_META_DATA, metaData });

    // propagate default deck language
    // TODO: pls make backend changes so we don't have to manually propagate this
    state.currentDeck.cards.forEach((card) => {
      const newCard = { ...card };
      newCard.front.language = metaData.frontLang;
      newCard.back.language = metaData.backLang;
      dispatchIfSafe({ type: DECK_REDUCER_TYPE.UPDATE_CARD, card });
    });
  }

  function addCard(card: Card) {
    // TODO: ideally should be default (see above method)
    // set card default language to be the same as decks
    card.front.language = state.currentDeck.metaData.frontLang;
    card.back.language = state.currentDeck.metaData.backLang;

    dispatchIfSafe({ type: DECK_REDUCER_TYPE.ADD_CARD, card });
  }

  function deleteCard(card: Card) {
    dispatchIfSafe({ type: DECK_REDUCER_TYPE.DELETE_CARD, card });
  }

  function updateCard(card: Card) {
    dispatchIfSafe({ type: DECK_REDUCER_TYPE.UPDATE_CARD, card });
  }

  function reorderCards(cards: Card[]) {
    dispatchIfSafe({ type: DECK_REDUCER_TYPE.REORDER_CARDS, cards });
  }

  function setDeck(newDeck: Deck) {
    dispatchIfSafe({ type: DECK_REDUCER_TYPE.SET_DECK, newDeck });
  }

  function dispatchIfSafe(dispatchArgs: DeckReducerDispatch) {
    if (!isSaving) {
      dispatch(dispatchArgs);
    }
  }

  return {
    deck: state.currentDeck,
    hasUnsavedChanges: state.hasUnsavedChanges,
    isSaving,
    addCard,
    deleteCard,
    updateCard,
    updateMetaData,
    save,
    discardChanges,
    reorderCards,
    setDeck,
  };
};

function deckEditorReducer(state: DeckReducerState, action: DeckReducerDispatch): DeckReducerState {
  const { currentDeck, addedCards, deletedCards, updatedCards } = state;
  const { type, newDeck, card, cards, metaData } = action;

  switch (type) {
    case DECK_REDUCER_TYPE.ADD_CARD:
      if (card === undefined) throw new Error('action.card must not be undefined');
      return {
        ...state,
        currentDeck: addCardToDeck(card, currentDeck),
        addedCards: addCardToMap(card, addedCards),
        hasUnsavedChanges: true,
      };

    case DECK_REDUCER_TYPE.DELETE_CARD:
      if (card === undefined) throw new Error('action.card must not be undefined');
      return {
        ...state,
        currentDeck: removeCardFromDeck(card, currentDeck),
        addedCards: removeCardFromMap(card, addedCards),
        updatedCards: removeCardFromMap(card, updatedCards),
        deletedCards: addCardToMap(card, deletedCards),
        hasUnsavedChanges: true,
      };

    case DECK_REDUCER_TYPE.UPDATE_META_DATA:
      if (metaData === undefined) throw new Error('action.metaData must not be undefined');
      return { ...state, currentDeck: { ...currentDeck, metaData }, hasUnsavedChanges: true };

    case DECK_REDUCER_TYPE.UPDATE_CARD:
      if (card === undefined) throw new Error('action.card must not be undefined');
      return {
        ...state,
        currentDeck: updateCardInDeck(card, currentDeck),
        addedCards: !card.id ? addCardToMap(card, addedCards) : addedCards,
        updatedCards: card.id ? addCardToMap(card, updatedCards) : updatedCards,
        hasUnsavedChanges: true,
      };

    case DECK_REDUCER_TYPE.REORDER_CARDS:
      if (cards === undefined) throw new Error('action.cards must not be undefined');
      // Todo: find reordered card
      // Todo: update reordered card
      // Todo: add card to updatedCards map
      return {
        ...state,
        currentDeck: { ...currentDeck, cards: cards },
        hasUnsavedChanges: true,
      };

    case DECK_REDUCER_TYPE.SET_DECK:
      if (newDeck === undefined) throw new Error('action.deck must not be undefined');
      return {
        savedDeck: newDeck,
        currentDeck: newDeck,
        addedCards: {},
        deletedCards: {},
        updatedCards: {},
        hasUnsavedChanges: false,
      };

    default:
      throw new Error('unrecognized dispatch action type');
  }
}

function addCardToMap(card: Card, map: CardMap) {
  return { ...map, [card.key]: card };
}

function removeCardFromMap(card: Card, map: CardMap) {
  const newMap = { ...map };
  delete newMap[card.key];
  return newMap;
}

function removeCardFromDeck(card: Card, deck: Deck) {
  const cardIndex = deck.cards.findIndex((deckCard) => card.key === deckCard.key);
  const newCards = [...deck.cards];
  newCards.splice(cardIndex, 1);
  return { ...deck, cards: newCards };
}

function updateCardInDeck(card: Card, deck: Deck) {
  const cardIndex = deck.cards.findIndex((deckCard) => card.key === deckCard.key);
  const newCards = [...deck.cards];
  newCards[cardIndex] = card;
  return { ...deck, cards: newCards };
}

function addCardToDeck(card: Card, deck: Deck) {
  return { ...deck, cards: [...deck.cards, card] };
}
