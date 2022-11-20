import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { noop } from '@/helpers/func';
import { Deck } from '@/models/deck';
import { getTestFoxCard } from '@/models/mock/card.mock';
import { testEmptyDeck, testEnglishDeck } from '@/models/mock/deck.mock';
import { DeckCover } from './deck-cover';

describe('DeckCover', () => {
  it('should render correctly with default props', () => {
    const deck = testEnglishDeck();
    render(<DeckCover deck={deck} onStudyClick={noop} onViewClick={noop} />);
    expect(screen.queryAllByText(deck.metaData.title)[0]).toBeVisible();
  });

  it('should not fire `onClick` if set to not flippable', () => {
    const deck = testEnglishDeck();
    const mockOnClick = jest.fn();
    render(
      <DeckCover
        deck={deck}
        onClick={mockOnClick}
        flippable={false}
        onStudyClick={noop}
        onViewClick={noop}
      />
    );

    userEvent.click(screen.queryAllByText(deck.metaData.title)[0]);
    expect(mockOnClick).toBeCalled();
  });

  it('should fire onStudyClick only when there are cards', () => {
    const emptyDeck = testEmptyDeck();
    const mockOnStudyClick = jest.fn();
    const { rerender } = render(
      <DeckCover
        deck={emptyDeck}
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
      metaData: { ...emptyDeck.metaData, cardIds: [...Array(testCards.length)] },
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
    const emptyDeck = testEmptyDeck();
    const mockOnClick = jest.fn();
    const mockOnViewClick = jest.fn();
    const mockOnStudyClick = jest.fn();
    render(
      <DeckCover
        deck={emptyDeck}
        onClick={mockOnClick}
        onViewClick={mockOnViewClick}
        onStudyClick={mockOnStudyClick}
      />
    );

    userEvent.click(screen.queryAllByText(emptyDeck.metaData.title)[0]);
    expect(mockOnClick).toBeCalledTimes(1);

    userEvent.click(screen.getByText('view'));
    expect(mockOnViewClick).toBeCalledTimes(1);

    // study is disabled with no cards
    userEvent.click(screen.getByText('study'));
    expect(mockOnStudyClick).toBeCalledTimes(0);
  });
});
