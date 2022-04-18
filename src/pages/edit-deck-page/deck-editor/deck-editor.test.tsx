import React from 'react';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { DeckEditor } from './deck-editor';
import userEvent from '@testing-library/user-event';
import { createNewDeck } from '../../../models/deck';
import { noop } from '../../../helpers/func';
import { testEnglishDeck } from '../../../models/mock/deck.mock';

jest.mock('../../../hooks/use-prompt');

describe('DeckEditor', () => {
  beforeEach(() => {
    // setup portal element for modal to render on
    document.body.innerHTML = `<div id="portal"></div>`;
  });

  it('should render correctly with default props', () => {
    render(
      <DeckEditor
        initialDeck={createNewDeck()}
        isNewDeck={false}
        onCreateDeckClick={noop}
        onDeleteDeckClick={noop}
        onGoBackClick={noop}
      />
    );
    expect(screen.queryByText('edit deck')).toBeInTheDocument();
    expect(screen.queryByText('save')).toBeInTheDocument();
    expect(screen.queryByText('new card')).toBeInTheDocument();
    expect(screen.queryByText('discard changes')).not.toBeInTheDocument();
    expect(
      screen.queryByText('you currently have no cards. click "+ new card" to get started')
    ).toBeInTheDocument();
  });

  it('should add a new card on click', () => {
    render(
      <DeckEditor
        initialDeck={createNewDeck()}
        isNewDeck={false}
        onCreateDeckClick={noop}
        onDeleteDeckClick={noop}
        onGoBackClick={noop}
      />
    );

    userEvent.click(screen.getByText('new card'));

    expect(screen.queryByPlaceholderText('add term')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('add definition')).toBeInTheDocument();
  });

  it('should display discard changes button when deck is not saved', () => {
    render(
      <DeckEditor
        initialDeck={createNewDeck()}
        isNewDeck={false}
        onCreateDeckClick={noop}
        onDeleteDeckClick={noop}
        onGoBackClick={noop}
      />
    );
    userEvent.click(screen.getByText('new card'));
    expect(screen.queryByText('discard changes')).toBeInTheDocument();
  });

  it('should call discard changes on discard changes click', () => {
    render(
      <DeckEditor
        initialDeck={createNewDeck()}
        isNewDeck={false}
        onCreateDeckClick={noop}
        onDeleteDeckClick={noop}
        onGoBackClick={noop}
      />
    );

    userEvent.click(screen.getByText('new card'));
    expect(screen.queryByPlaceholderText('add term')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('add definition')).toBeInTheDocument();

    userEvent.click(screen.getByText('discard changes'));

    expect(screen.queryByPlaceholderText('add term')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('add definition')).not.toBeInTheDocument();
  });

  it('should hide discard changes button on save', async () => {
    render(
      <DeckEditor
        initialDeck={createNewDeck()}
        isNewDeck={false}
        onCreateDeckClick={noop}
        onDeleteDeckClick={noop}
        onGoBackClick={noop}
      />
    );

    userEvent.click(screen.getByText('new card'));

    expect(screen.getByText('discard changes')).toBeInTheDocument();

    userEvent.click(screen.getByText('save'));

    await waitForElementToBeRemoved(() => screen.queryByText('discard changes'));
  });

  it('should call onDeleteDeckClick when delete deck is clicked', () => {
    const mockOnDeleteDeckClick = jest.fn();
    render(
      <DeckEditor
        initialDeck={createNewDeck()}
        isNewDeck={false}
        onCreateDeckClick={noop}
        onDeleteDeckClick={mockOnDeleteDeckClick}
        onGoBackClick={noop}
      />
    );
    userEvent.click(screen.getByText('advanced settings'));
    userEvent.click(screen.getByText('delete deck'));

    expect(mockOnDeleteDeckClick).toBeCalled();
  });

  it('should call onGoBackClick when go back is clicked', () => {
    const mockOnGoBackClick = jest.fn();
    render(
      <DeckEditor
        initialDeck={createNewDeck()}
        isNewDeck={false}
        onCreateDeckClick={noop}
        onDeleteDeckClick={noop}
        onGoBackClick={mockOnGoBackClick}
      />
    );
    userEvent.click(screen.getByText('back to decks'));

    expect(mockOnGoBackClick).toBeCalled();
  });

  it('should call onCreateDeckClick when create is clicked', () => {
    const mockOnCreateDeckClick = jest.fn();
    render(
      <DeckEditor
        initialDeck={createNewDeck()}
        isNewDeck={true}
        onCreateDeckClick={mockOnCreateDeckClick}
        onDeleteDeckClick={noop}
        onGoBackClick={noop}
      />
    );
    userEvent.click(screen.getByText('create'));

    expect(mockOnCreateDeckClick).toBeCalled();
  });

  it('should be reset when initialDeck is changed', () => {
    const firstDeck = testEnglishDeck(0);
    const { rerender } = render(
      <DeckEditor
        initialDeck={firstDeck}
        isNewDeck={true}
        onCreateDeckClick={noop}
        onDeleteDeckClick={noop}
        onGoBackClick={noop}
      />
    );

    expect(screen.queryByDisplayValue(firstDeck.metaData.title)).toBeInTheDocument();

    rerender(
      <DeckEditor
        initialDeck={createNewDeck()}
        isNewDeck={true}
        onCreateDeckClick={noop}
        onDeleteDeckClick={noop}
        onGoBackClick={noop}
      />
    );

    expect(screen.queryByDisplayValue(firstDeck.metaData.title)).not.toBeInTheDocument();
  });
});
