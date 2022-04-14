import { useReducer } from 'react';
import { Card, createNewCard } from '../models/card';
import { Deck, DeckMetaData } from '../models/deck';

type CardMap = { [id: string]: Card };

interface DeckEditorState {
  deck: Deck;
  hasUnsavedChanges: boolean;
}

interface DeckEditorMethods {
  save: () => void;
  discardChanges: () => void;
  addCard: () => void;
  deleteCard: (card: Card) => void;
  updateCard: (card: Card) => void;
  updateMetaData: (metaData: DeckMetaData) => void;
  reorderCards: (cards: Card[]) => void;
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
}

const enum DECK_REDUCER_TYPE {
  SAVE = 'SAVE',
  DISCARD_CHANGES = 'DISCARD_CHANGES',
  UPDATE_META_DATA = 'UPDATE_META_DATA',
  ADD_CARD = 'ADD_CARD',
  DELETE_CARD = 'DELETE_CARD',
  UPDATE_CARD = 'UPDATE_CARD',
  REORDER_CARDS = 'REORDER_CARDS',
}

export const useDeckEditor = (deck: Deck): [state: DeckEditorState, methods: DeckEditorMethods] => {
  const [state, dispatch] = useReducer(deckEditorReducer, {
    currentDeck: deck,
    savedDeck: deck,
    hasUnsavedChanges: false,
    addedCards: {},
    updatedCards: {},
    deletedCards: {},
  });

  function save() {
    dispatch({ type: DECK_REDUCER_TYPE.SAVE });
  }
  function discardChanges() {
    dispatch({ type: DECK_REDUCER_TYPE.DISCARD_CHANGES });
  }
  function updateMetaData(metaData: DeckMetaData) {
    dispatch({ type: DECK_REDUCER_TYPE.UPDATE_META_DATA, metaData });
  }
  function addCard() {
    dispatch({ type: DECK_REDUCER_TYPE.ADD_CARD });
  }
  function deleteCard(card: Card) {
    dispatch({ type: DECK_REDUCER_TYPE.DELETE_CARD, card });
  }
  function updateCard(card: Card) {
    dispatch({ type: DECK_REDUCER_TYPE.UPDATE_CARD, card });
  }
  function reorderCards(cards: Card[]) {
    dispatch({ type: DECK_REDUCER_TYPE.REORDER_CARDS, cards });
  }

  return [
    { deck: state.currentDeck, hasUnsavedChanges: state.hasUnsavedChanges },
    { addCard, deleteCard, updateCard, updateMetaData, save, discardChanges, reorderCards },
  ];
};

function deckEditorReducer(state: DeckReducerState, action: DeckReducerDispatch): DeckReducerState {
  const { currentDeck, savedDeck, addedCards, deletedCards, updatedCards } = state;
  const { type, card, cards, metaData } = action;

  switch (type) {
    case DECK_REDUCER_TYPE.ADD_CARD:
      const newCard = createNewCard();
      return {
        ...state,
        currentDeck: addCardToDeck(newCard, currentDeck),
        addedCards: addCardToMap(newCard, addedCards),
        hasUnsavedChanges: true,
      };

    case DECK_REDUCER_TYPE.DELETE_CARD:
      if (card === undefined) {
        throw new Error('action.card must not be undefined');
      }
      return {
        ...state,
        addedCards: removeCardFromMap(card, addedCards),
        updatedCards: removeCardFromMap(card, updatedCards),
        deletedCards: addCardToMap(card, deletedCards),
        currentDeck: removeCardFromDeck(card, currentDeck),
        hasUnsavedChanges: true,
      };

    case DECK_REDUCER_TYPE.SAVE:
      // Todo: make the API calls
      // Todo: update the id's of new cards
      return {
        ...state,
        savedDeck: currentDeck,
        addedCards: {},
        deletedCards: {},
        updatedCards: {},
        hasUnsavedChanges: false,
      };

    case DECK_REDUCER_TYPE.DISCARD_CHANGES:
      return {
        ...state,
        currentDeck: savedDeck,
        addedCards: {},
        deletedCards: {},
        updatedCards: {},
        hasUnsavedChanges: false,
      };

    case DECK_REDUCER_TYPE.UPDATE_META_DATA:
      if (metaData === undefined) throw new Error('action.metaData must not be undefined');

      return { ...state, currentDeck: { ...currentDeck, metaData }, hasUnsavedChanges: true };

    case DECK_REDUCER_TYPE.UPDATE_CARD:
      if (card === undefined) throw new Error('action.card must not be undefined');

      return {
        ...state,
        addedCards: !card.id ? addCardToMap(card, addedCards) : addedCards,
        updatedCards: card.id ? addCardToMap(card, updatedCards) : updatedCards,
        hasUnsavedChanges: true,
        currentDeck: updateCardInDeck(card, currentDeck),
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
  return { ...deck, cards: [card, ...deck.cards] };
}
