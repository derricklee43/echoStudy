import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { noop } from '@/helpers/func';
import { Card } from '@/models/card';
import { getTestFoxCard, getTestMonkeyCard, getTestMouseCard } from '@/models/mock/card.mock';
import { FlashcardSet } from './flashcard-set';

describe('FlashcardSet', () => {
  let TEST_FOX_CARD: Card;
  let TEST_MONKEY_CARD: Card;
  let TEST_MOUSE_CARD: Card;
  let FOX_MONKEY_MOUSE: Card[];

  beforeEach(() => {
    TEST_FOX_CARD = getTestFoxCard();
    TEST_MONKEY_CARD = getTestMonkeyCard();
    TEST_MOUSE_CARD = getTestMouseCard();
    FOX_MONKEY_MOUSE = [TEST_FOX_CARD, TEST_MONKEY_CARD, TEST_MOUSE_CARD];
  });
  it('should render correctly with default props', () => {
    render(
      <FlashcardSet
        initialActiveCardKey=""
        onCardChange={noop}
        onCardReorder={noop}
        onDeleteCardClick={noop}
        cards={[TEST_FOX_CARD]}
      />
    );
    expect(screen.queryByDisplayValue(TEST_FOX_CARD.front.text)).toBeInTheDocument();
    expect(screen.queryByDisplayValue(TEST_FOX_CARD.back.text)).toBeInTheDocument();
  });

  it('should render correctly with multiple cards', () => {
    render(
      <FlashcardSet
        initialActiveCardKey=""
        onCardChange={noop}
        onCardReorder={noop}
        onDeleteCardClick={noop}
        cards={FOX_MONKEY_MOUSE}
      />
    );
    expect(screen.queryAllByDisplayValue(TEST_MONKEY_CARD.front.text).length).toBe(1);
    expect(screen.queryAllByDisplayValue(TEST_MONKEY_CARD.front.text).length).toBe(1);
    expect(screen.queryAllByDisplayValue(TEST_MOUSE_CARD.front.text).length).toBe(1);
  });

  it('should call `onDeleteCardClick` when trash icon is clicked', () => {
    const mockOnDeleteCard = jest.fn();
    render(
      <FlashcardSet
        initialActiveCardKey=""
        onCardChange={noop}
        onCardReorder={noop}
        cards={FOX_MONKEY_MOUSE}
        onDeleteCardClick={mockOnDeleteCard}
      />
    );

    // click the trash icon on the first card
    const firstTrashIcon = screen.queryAllByRole('button', { name: 'trash' })[0];
    userEvent.click(firstTrashIcon);
    expect(mockOnDeleteCard).toBeCalledWith(FOX_MONKEY_MOUSE[0]);
  });

  it('should move card up and wrap around when up-arrow clicked', () => {
    const mockOnCardReorder = jest.fn();
    render(
      <FlashcardSet
        initialActiveCardKey=""
        onCardChange={noop}
        onDeleteCardClick={noop}
        cards={FOX_MONKEY_MOUSE}
        onCardReorder={(cards: Card[]) => mockOnCardReorder(cards.map((card) => card.front.text))}
      />
    );

    // up on MONKEY: FOX_MONKEY_MOUSE --> MONKEY_FOX_MOUSE
    userEvent.click(getUpArrowByIndex(1));
    expect(mockOnCardReorder).toBeCalledWith(['monkey', 'fox', 'mouse']);
  });

  it('should wrap around if up-arrow clicked on topmost card', () => {
    const mockOnCardReorder = jest.fn();
    render(
      <FlashcardSet
        cards={FOX_MONKEY_MOUSE}
        initialActiveCardKey=""
        onCardChange={noop}
        onDeleteCardClick={noop}
        onCardReorder={(cards: Card[]) => mockOnCardReorder(cards.map((card) => card.front.text))}
      />
    );

    // up on FOX: FOX_MONKEY_MOUSE --> MONKEY_MOUSE_FOX
    userEvent.click(getUpArrowByIndex(0));
    expect(mockOnCardReorder).toBeCalledWith(['monkey', 'mouse', 'fox']);
  });

  it('should move card down when down-arrow clicked', () => {
    const mockOnCardReorder = jest.fn();
    render(
      <FlashcardSet
        initialActiveCardKey=""
        onCardChange={noop}
        onDeleteCardClick={noop}
        cards={FOX_MONKEY_MOUSE}
        onCardReorder={(cards: Card[]) => mockOnCardReorder(cards.map((card) => card.front.text))}
      />
    );

    // down on MONKEY: FOX_MONKEY_MOUSE --> FOX_MOUSE_MONKEY
    userEvent.click(getDownArrowByIndex(1));
    expect(mockOnCardReorder).toBeCalledWith(['fox', 'mouse', 'monkey']);
  });

  it('should wrap around if down-arrow clicked on bottommost card', () => {
    const mockOnCardReorder = jest.fn();
    render(
      <FlashcardSet
        initialActiveCardKey=""
        onCardChange={noop}
        onDeleteCardClick={noop}
        cards={FOX_MONKEY_MOUSE}
        onCardReorder={(cards: Card[]) => mockOnCardReorder(cards.map((card) => card.front.text))}
      />
    );

    // down on MOUSE: FOX_MONKEY_MOUSE --> MOUSE_FOX_MONKEY
    userEvent.click(getDownArrowByIndex(2));
    expect(mockOnCardReorder).toBeCalledWith(['mouse', 'fox', 'monkey']);
  });

  it('should show arrows and trash', () => {
    const testCard = getTestFoxCard();
    render(
      <FlashcardSet
        initialActiveCardKey=""
        onCardChange={noop}
        onCardReorder={noop}
        onDeleteCardClick={noop}
        cards={[testCard]}
      />
    );
    expect(screen.queryByRole('button', { name: 'up-arrow' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'down-arrow' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'trash' })).toBeInTheDocument();
  });

  function getUpArrowByIndex(index: number): HTMLElement {
    return screen.queryAllByRole('button', { name: 'up-arrow' })[index];
  }

  function getDownArrowByIndex(index: number): HTMLElement {
    return screen.queryAllByRole('button', { name: 'down-arrow' })[index];
  }
});
