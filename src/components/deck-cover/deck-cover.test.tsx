import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { noop } from '@/helpers/func';
import { Deck } from '@/models/deck';
import { getTestFoxCard } from '@/models/mock/card.mock';
import { testEnglishDeck } from '@/models/mock/deck.mock';
import { DeckCover } from './deck-cover';

const TEST_DECK = testEnglishDeck();

describe('DeckCover', () => {
  it('should render correctly with default props', () => {
    render(<DeckCover deck={TEST_DECK} onStudyClick={noop} onViewClick={noop} />);
    expect(screen.queryAllByText(TEST_DECK.metaData.title)[0]).toBeVisible();
  });

  it('should not fire `onClick` if set to not flippable', () => {
    const mockOnClick = jest.fn();
    render(
      <DeckCover
        deck={TEST_DECK}
        onClick={mockOnClick}
        flippable={false}
        onStudyClick={noop}
        onViewClick={noop}
      />
    );

    userEvent.click(screen.queryAllByText(TEST_DECK.metaData.title)[0]);
    expect(mockOnClick).toBeCalled();
  });

  it('should fire onStudyClick only when there are cards', () => {
    const mockOnStudyClick = jest.fn();
    const { rerender } = render(
      <DeckCover
        deck={TEST_DECK}
        onClick={noop}
        onViewClick={noop}
        onStudyClick={mockOnStudyClick}
      />
    );

    // study is disabled with no cards
    userEvent.click(screen.getByText('study'));
    expect(mockOnStudyClick).toBeCalledTimes(0);

    // rerender using deck with cards
    const testCards = [...Array(5)].map(() => getTestFoxCard());
    const deckWithCards: Deck = {
      metaData: { ...TEST_DECK.metaData, cardIds: [...Array(testCards.length)] },
      cards: testCards,
    };
    rerender(
      <DeckCover
        deck={deckWithCards}
        onClick={noop}
        onViewClick={noop}
        onStudyClick={mockOnStudyClick}
      />
    );

    // study button should be enabled with cards
    userEvent.click(screen.getByText('study'));
    expect(mockOnStudyClick).toBeCalledTimes(1);
  });

  it('should fire all default click listeners', () => {
    const mockOnClick = jest.fn();
    const mockOnViewClick = jest.fn();
    const mockOnStudyClick = jest.fn();
    render(
      <DeckCover
        deck={TEST_DECK}
        onClick={mockOnClick}
        onViewClick={mockOnViewClick}
        onStudyClick={mockOnStudyClick}
      />
    );

    userEvent.click(screen.queryAllByText(TEST_DECK.metaData.title)[0]);
    expect(mockOnClick).toBeCalledTimes(1);

    userEvent.click(screen.getByText('view'));
    expect(mockOnViewClick).toBeCalledTimes(1);

    // study is disabled with no cards
    userEvent.click(screen.getByText('study'));
    expect(mockOnStudyClick).toBeCalledTimes(0);
  });
});
