import React from 'react';
import { render, screen } from '@testing-library/react';
import { DeckEditor } from './deck-editor';
import { testEnglishDeck } from '../../models/mock/deck.mock';
import { noop } from '../../helpers/func';
import userEvent from '@testing-library/user-event';

const TEST_LABEL = 'TEST_INITIAL_TEXT';

describe('DeckEditor', () => {
  it('should render correctly with default props', () => {
    const testDeck = testEnglishDeck(1);
    render(
      <DeckEditor
        label={TEST_LABEL}
        deck={testDeck}
        onGoBackClick={noop}
        onDeckChange={noop}
        onDeleteClick={noop}
        isDeckSaved={false}
        onSaveClick={noop}
        onDiscardChangesClick={noop}
      />
    );
    expect(screen.queryByText(TEST_LABEL)).toBeInTheDocument();
    expect(screen.queryByDisplayValue(testDeck.title)).toBeInTheDocument();
    expect(screen.queryByText('save')).toBeInTheDocument();
    expect(screen.queryByText('new card')).toBeInTheDocument();
    expect(
      screen.queryByText('you currently have no cards. click "+ new card" to get started')
    ).toBeInTheDocument();
  });

  it('should add a new card on click', () => {
    const testDeck = testEnglishDeck(1);
    render(
      <DeckEditor
        label={TEST_LABEL}
        deck={testDeck}
        onGoBackClick={noop}
        onDeckChange={noop}
        onDeleteClick={noop}
        isDeckSaved={false}
        onSaveClick={noop}
        onDiscardChangesClick={noop}
      />
    );
    userEvent.click(screen.getByText('new card'));
    expect(screen.queryByPlaceholderText('add term')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('add definition')).toBeInTheDocument();
  });

  it('should display discard changes button when deck is not saved', () => {
    const testDeck = testEnglishDeck(1);
    render(
      <DeckEditor
        label={TEST_LABEL}
        deck={testDeck}
        onGoBackClick={noop}
        onDeckChange={noop}
        onDeleteClick={noop}
        isDeckSaved={true}
        onSaveClick={noop}
        onDiscardChangesClick={noop}
      />
    );
    userEvent.click(screen.getByText('new card'));
    expect(screen.queryByText('discard changes')).toBeInTheDocument();
  });

  it('should call onDiscardChanges on discard changes click', () => {
    const testDeck = testEnglishDeck(1);
    const mockOnDiscardChanges = jest.fn();
    render(
      <DeckEditor
        label={TEST_LABEL}
        deck={testDeck}
        onGoBackClick={noop}
        onDeckChange={noop}
        onDeleteClick={noop}
        isDeckSaved={true}
        onSaveClick={noop}
        onDiscardChangesClick={mockOnDiscardChanges}
      />
    );

    userEvent.click(screen.getByText('new card'));
    expect(screen.queryByPlaceholderText('add term')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('add definition')).toBeInTheDocument();

    userEvent.click(screen.getByText('discard changes'));
    expect(mockOnDiscardChanges).toHaveBeenCalled();
  });

  it('should call onDeckChange on deck change', () => {
    const testDeck = testEnglishDeck(1);
    const mockOnDeckChange = jest.fn();
    render(
      <DeckEditor
        label={TEST_LABEL}
        deck={testDeck}
        onGoBackClick={noop}
        onDeckChange={mockOnDeckChange}
        onDeleteClick={noop}
        isDeckSaved={false}
        onSaveClick={noop}
        onDiscardChangesClick={noop}
      />
    );

    userEvent.click(screen.getByText('new card'));
    expect(screen.queryByPlaceholderText('add term')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('add definition')).toBeInTheDocument();
    expect(mockOnDeckChange).toHaveBeenCalled();
  });
});
