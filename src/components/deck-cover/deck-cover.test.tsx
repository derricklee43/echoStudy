import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeckCover } from './deck-cover';
import { noop } from '../../helpers/func';
import { testEnglishDeck } from '../../models/mock/deck.mock';

const TEST_DECK = testEnglishDeck(0);

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

  it('should fire all click listeners', () => {
    const mockAllOnClick = jest.fn();
    render(
      <DeckCover
        deck={TEST_DECK}
        onClick={mockAllOnClick}
        onStudyClick={mockAllOnClick}
        onViewClick={mockAllOnClick}
      />
    );

    userEvent.click(screen.queryAllByText(TEST_DECK.metaData.title)[0]);
    userEvent.click(screen.getByText('view'));
    userEvent.click(screen.getByText('study'));
    expect(mockAllOnClick).toBeCalledTimes(3);
  });
});
