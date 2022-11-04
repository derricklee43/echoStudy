import { useReducer, useState } from 'react';
import { getIntersection } from '@/helpers/array';
import { Card, CardSide, DraftCard, filterBlankCards } from '@/models/card';
import { Deck, DeckMetaData } from '@/models/deck';
import { LazyAudio } from '@/models/lazy-audio';
import { useCardsClient } from './api/use-cards-client';
import { useDecksClient } from './api/use-decks-client';

type CardMap = { [id: string]: Card };
type AddedCustomAudios = Record<string, Partial<Record<CardSide, Blob>>>;
type DeletedCustomAudios = Record<string, CardSide[]>;
interface DeckEditorReturn {
  deck: Deck;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  save: () => void;
  discardChanges: () => void;
  addCard: (card: Card) => void;
  addCustomAudio: (card: Card, cardSide: CardSide, customAudio: Blob) => void;
  deleteCard: (card: Card) => void;
  deleteCustomAudio: (card: Card, cardSide: CardSide) => void;
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
  addedCustomAudios: AddedCustomAudios;
  deletedCustomAudios: DeletedCustomAudios;
}

type DeckReducerDispatch =
  | { type: DECK_REDUCER_TYPE.UPDATE_META_DATA; metaData: DeckMetaData }
  | { type: DECK_REDUCER_TYPE.ADD_CARD; card: Card }
  | { type: DECK_REDUCER_TYPE.DELETE_CARD; card: Card }
  | { type: DECK_REDUCER_TYPE.UPDATE_CARD; card: Card }
  | { type: DECK_REDUCER_TYPE.REORDER_CARDS; cards: Card[] }
  | { type: DECK_REDUCER_TYPE.SET_DECK; deck: Deck }
  | { type: DECK_REDUCER_TYPE.ADD_CUSTOM_AUDIO; card: Card; cardSide: CardSide; customAudio: Blob }
  | { type: DECK_REDUCER_TYPE.DELETE_CUSTOM_AUDIO; card: Card; cardSide: CardSide };

const enum DECK_REDUCER_TYPE {
  UPDATE_META_DATA = 'UPDATE_META_DATA',
  ADD_CARD = 'ADD_CARD',
  DELETE_CARD = 'DELETE_CARD',
  UPDATE_CARD = 'UPDATE_CARD',
  REORDER_CARDS = 'REORDER_CARDS',
  SET_DECK = 'SET_DECK',
  ADD_CUSTOM_AUDIO = 'ADD_CUSTOM_AUDIO',
  DELETE_CUSTOM_AUDIO = 'DELETE_CUSTOM_AUDIO',
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
    addedCustomAudios: {},
    deletedCustomAudios: {},
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

      const addedDraftCards = addedCards.map((c) =>
        addCustomAudioToCard(c, state.addedCustomAudios, state.deletedCustomAudios)
      );

      const updatedDraftCards = updatedCards.map((c) =>
        addCustomAudioToCard(c, state.addedCustomAudios, state.deletedCustomAudios)
      );

      const cardPromises = [
        decksClient.updateDeckById(state.currentDeck),
        ...[addedCards.length > 0 ? cardsClient.addCards(addedDraftCards, deckId) : []],
        ...[updatedCards.length > 0 ? cardsClient.updateCards(updatedDraftCards) : []],
        ...[deletedCards.length > 0 ? cardsClient.deleteCards(deletedCards) : []],
        // Todo: we need to send the reordered cards too
      ];
      await Promise.all(cardPromises);

      dispatch({ type: DECK_REDUCER_TYPE.SET_DECK, deck: state.currentDeck });
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

  function addCustomAudio(card: Card, cardSide: CardSide, customAudio: Blob) {
    const updatedCardContent = {
      ...card[cardSide],
      customAudio: new LazyAudio(URL.createObjectURL(customAudio)),
    };
    const updatedCard: Card = { ...card, [cardSide]: updatedCardContent };
    updateCard(updatedCard);
    dispatchIfSafe({ type: DECK_REDUCER_TYPE.ADD_CUSTOM_AUDIO, card, cardSide, customAudio });
  }

  function deleteCustomAudio(card: Card, cardSide: CardSide) {
    const updatedCard = { ...card };
    delete updatedCard[cardSide].customAudio;
    updateCard(updatedCard);
    dispatchIfSafe({ type: DECK_REDUCER_TYPE.DELETE_CUSTOM_AUDIO, card, cardSide });
  }

  function setDeck(deck: Deck) {
    dispatchIfSafe({ type: DECK_REDUCER_TYPE.SET_DECK, deck });
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
    addCustomAudio,
    deleteCustomAudio,
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
  const {
    currentDeck,
    addedCards,
    deletedCards,
    updatedCards,
    addedCustomAudios,
    deletedCustomAudios,
  } = state;

  switch (action.type) {
    case DECK_REDUCER_TYPE.ADD_CARD:
      return {
        ...state,
        currentDeck: addCardToDeck(action.card, currentDeck),
        addedCards: addCardToMap(action.card, addedCards),
        hasUnsavedChanges: true,
      };

    case DECK_REDUCER_TYPE.DELETE_CARD:
      return {
        ...state,
        currentDeck: removeCardFromDeck(action.card, currentDeck),
        addedCards: removeCardFromMap(action.card, addedCards),
        updatedCards: removeCardFromMap(action.card, updatedCards),
        deletedCards: addCardToMap(action.card, deletedCards),
        hasUnsavedChanges: true,
      };

    case DECK_REDUCER_TYPE.UPDATE_META_DATA:
      return {
        ...state,
        currentDeck: { ...currentDeck, metaData: action.metaData },
        hasUnsavedChanges: true,
      };

    case DECK_REDUCER_TYPE.UPDATE_CARD:
      return {
        ...state,
        currentDeck: updateCardInDeck(action.card, currentDeck),
        addedCards: !action.card.id ? addCardToMap(action.card, addedCards) : addedCards,
        updatedCards: action.card.id ? addCardToMap(action.card, updatedCards) : updatedCards,
        hasUnsavedChanges: true,
      };

    case DECK_REDUCER_TYPE.REORDER_CARDS:
      // Todo: find reordered card
      // Todo: update reordered card
      // Todo: add card to updatedCards map
      return {
        ...state,
        currentDeck: { ...currentDeck, cards: action.cards },
        hasUnsavedChanges: true,
      };

    case DECK_REDUCER_TYPE.SET_DECK:
      return {
        savedDeck: action.deck,
        currentDeck: action.deck,
        addedCards: {},
        deletedCards: {},
        updatedCards: {},
        addedCustomAudios: {},
        deletedCustomAudios: {},
        hasUnsavedChanges: false,
      };

    case DECK_REDUCER_TYPE.ADD_CUSTOM_AUDIO:
      return {
        ...state,
        deletedCustomAudios: removeCardSideFromDeletedCustomAudios(action.card, action.cardSide),
        addedCustomAudios: addAudioToAddedCustomAudios(
          action.card,
          action.cardSide,
          action.customAudio
        ),
      };

    case DECK_REDUCER_TYPE.DELETE_CUSTOM_AUDIO:
      return {
        ...state,
        deletedCustomAudios: addCardSideToDeletedCustomAudios(action.card, action.cardSide),
        addedCustomAudios: removeAudioFromAddedCustomAudios(action.card, action.cardSide),
      };

    default:
      throw new Error('unrecognized dispatch action type');
  }

  function addAudioToAddedCustomAudios(card: Card, side: CardSide, customAudio: Blob) {
    const customCardAudios = { ...addedCustomAudios[card.key], [side]: customAudio };
    return { ...addedCustomAudios, [card.key]: customCardAudios };
  }

  function removeAudioFromAddedCustomAudios(card: Card, side: CardSide) {
    const customCardAudios = { ...addedCustomAudios[card.key] };
    delete customCardAudios[side];
    return { ...addedCustomAudios, [card.key]: customCardAudios };
  }

  function addCardSideToDeletedCustomAudios(card: Card, side: CardSide) {
    const deletedCardSides = [...(deletedCustomAudios[card.key] ?? []), side];
    const uniqueDeletedCardSides = Array.from(new Set(deletedCardSides));
    return { ...deletedCustomAudios, [card.key]: uniqueDeletedCardSides };
  }

  function removeCardSideFromDeletedCustomAudios(card: Card, side: CardSide) {
    const deletedCardSides = [...(deletedCustomAudios[card.key] ?? [])].filter((s) => s === side);
    return { ...deletedCustomAudios, [card.key]: deletedCardSides };
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

function addCustomAudioToCard(
  card: Card,
  addedCustomAudios: AddedCustomAudios,
  deletedCustomAudios: DeletedCustomAudios
): DraftCard {
  const addedCardAudios = addedCustomAudios[card.key];
  const deletedCardAudios = deletedCustomAudios[card.key];

  const intersection = getIntersection(Object.keys(addedCardAudios), deletedCardAudios);
  if (intersection.length > 0) {
    throw Error('card side found in both addedCustomAudio and deletedCustomAudio records');
  }

  return {
    ...card,
    frontCustomAudio: deletedCardAudios.includes('front') ? new Blob() : addedCardAudios.front,
    backCustomAudio: deletedCardAudios.includes('back') ? new Blob() : addedCardAudios.back,
  };
}
