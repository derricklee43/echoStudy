import React from 'react';
import { ReadOnlyFlashcardSet } from './read-only-flashcard-set';
import { render, screen } from '@testing-library/react';
import { getTestFoxCard, getTestMonkeyCard, getTestMouseCard } from '../../models/mock/card.mock';
import { Card } from '../../models/card';

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
    render(<ReadOnlyFlashcardSet cards={[TEST_FOX_CARD]} />);
    expect(screen.queryByDisplayValue(TEST_FOX_CARD.front.text)).toBeInTheDocument();
    expect(screen.queryByDisplayValue(TEST_FOX_CARD.back.text)).toBeInTheDocument();
  });

  it('should render correctly with multiple cards', () => {
    render(<ReadOnlyFlashcardSet cards={FOX_MONKEY_MOUSE} />);
    expect(screen.queryAllByDisplayValue(TEST_MONKEY_CARD.front.text).length).toBe(1);
    expect(screen.queryAllByDisplayValue(TEST_MONKEY_CARD.front.text).length).toBe(1);
    expect(screen.queryAllByDisplayValue(TEST_MOUSE_CARD.front.text).length).toBe(1);
  });
});
