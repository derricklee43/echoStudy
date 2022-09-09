import { useReducer } from 'react';
import { Deck } from '../models/deck';
import { createNewLessonCard, LessonCard } from '../models/lesson-card';

interface DeckEditorReturn {
  upcomingCards: LessonCard[];
  seenCards: LessonCard[];
  currentCard: LessonCard;
  nextCard: (card: LessonCard) => void;
  previousCard: () => void;
}

interface DeckReducerState {
  upcomingCards: LessonCard[];
  seenCards: LessonCard[];
  currentCard: LessonCard;
}

interface DeckReducerDispatch {
  type: DECK_REDUCER_TYPE;
  card?: LessonCard;
}

const enum DECK_REDUCER_TYPE {
  NEXT_CARD = 'NEXT_CARD',
  PREVIOUS_CARD = 'PREVIOUS_CARD',
}

export const useLessonOrder = (deck: Deck): DeckEditorReturn => {
  const [firstCard, ...restCards] = getLessonCards(deck);
  const [state, dispatch] = useReducer(deckEditorReducer, {
    upcomingCards: restCards,
    seenCards: [],
    currentCard: firstCard,
  });

  function nextCard(card: LessonCard) {
    dispatch({ type: DECK_REDUCER_TYPE.NEXT_CARD, card });
  }
  function previousCard() {
    dispatch({ type: DECK_REDUCER_TYPE.PREVIOUS_CARD });
  }

  return { ...state, nextCard, previousCard };
};

function deckEditorReducer(state: DeckReducerState, action: DeckReducerDispatch): DeckReducerState {
  switch (action.type) {
    case DECK_REDUCER_TYPE.NEXT_CARD:
      if (action.card === undefined) throw Error('card cannot be empty when setting current card');
      if (state.upcomingCards.length === 0) {
        return { ...state, seenCards: [action.card, ...state.seenCards] };
      }
      return {
        currentCard: state.upcomingCards[0],
        upcomingCards: state.upcomingCards.slice(1),
        seenCards: [action.card, ...state.seenCards],
      };

    case DECK_REDUCER_TYPE.PREVIOUS_CARD:
      if (state.seenCards.length === 0) {
        return { ...state };
      }
      return {
        currentCard: state.seenCards[0],
        seenCards: state.seenCards.slice(1),
        upcomingCards: [state.currentCard, ...state.upcomingCards],
      };

    default:
      throw new Error('unrecognized dispatch action type');
  }
}

// TODO: Add Sorting and Filtering based in settings
function getLessonCards(deck: Deck): LessonCard[] {
  return deck.cards.map((card) => createNewLessonCard(card, 1));
}
