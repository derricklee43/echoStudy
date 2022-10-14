import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTestRoots } from '@/app.test';
import { noop } from '@/helpers/func';
import { createNewDeck } from '@/models/deck';
import { testEnglishDeck } from '@/models/mock/deck.mock';
import { DeckEditor } from './deck-editor';

jest.mock('../../../hooks/use-prompt');

describe('DeckEditor', () => {
  beforeEach(() => {
    // setup portal element for modal to render on
    document.body.innerHTML = `<div id="portal"></div>`;
  });

  it('should render correctly with default props', () => {
    renderWithTestRoots(
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
    expect(screen.queryByText('back to deck')).toBeInTheDocument();
    expect(screen.queryByText('discard changes')).not.toBeInTheDocument();
    expect(
      screen.queryByText('you currently have no cards. click "+ new card" to get started')
    ).toBeInTheDocument();
  });

  it('should show "go back to decks" when is new deck', () => {
    renderWithTestRoots(
      <DeckEditor
        initialDeck={createNewDeck()}
        isNewDeck={true}
        onCreateDeckClick={noop}
        onDeleteDeckClick={noop}
        onGoBackClick={noop}
      />
    );
    expect(screen.queryByText('back to decks')).toBeInTheDocument();
  });

  it('should add a new card on click', () => {
    renderWithTestRoots(
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
    renderWithTestRoots(
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
    renderWithTestRoots(
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

  // Todo: fix API calls in hook method and uncomment
  // it('should hide discard changes button on save', async () => {
  //   renderWithTestRoots(
  //     <DeckEditor
  //       initialDeck={createNewDeck()}
  //       isNewDeck={false}
  //       onCreateDeckClick={noop}
  //       onDeleteDeckClick={noop}
  //       onGoBackClick={noop}
  //     />
  //   );

  //   userEvent.click(screen.getByText('new card'));

  //   expect(screen.getByText('discard changes')).toBeInTheDocument();

  //   userEvent.click(screen.getByText('save'));

  //   await waitForElementToBeRemoved(() => screen.queryByText('discard changes'));
  // });

  it('should call onDeleteDeckClick when delete deck is clicked', () => {
    const mockOnDeleteDeckClick = jest.fn();
    renderWithTestRoots(
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
    renderWithTestRoots(
      <DeckEditor
        initialDeck={createNewDeck()}
        isNewDeck={false}
        onCreateDeckClick={noop}
        onDeleteDeckClick={noop}
        onGoBackClick={mockOnGoBackClick}
      />
    );
    userEvent.click(screen.getByText('back to deck'));

    expect(mockOnGoBackClick).toBeCalled();
  });

  it('should call onCreateDeckClick when create is clicked', () => {
    const mockOnCreateDeckClick = jest.fn();
    const deck = createNewDeck();
    deck.metaData.title = 'TEST_TITLE';
    deck.metaData.desc = 'TEST_DESC';
    renderWithTestRoots(
      <DeckEditor
        initialDeck={deck}
        isNewDeck={true}
        onCreateDeckClick={mockOnCreateDeckClick}
        onDeleteDeckClick={noop}
        onGoBackClick={noop}
      />
    );
    userEvent.click(screen.getByText('create'));

    expect(mockOnCreateDeckClick).toBeCalled();
  });

  it('should call disable create button when title is empty', () => {
    const mockOnCreateDeckClick = jest.fn();
    renderWithTestRoots(
      <DeckEditor
        initialDeck={createNewDeck()}
        isNewDeck={true}
        onCreateDeckClick={mockOnCreateDeckClick}
        onDeleteDeckClick={noop}
        onGoBackClick={noop}
      />
    );
    userEvent.click(screen.getByText('create'));

    expect(mockOnCreateDeckClick).not.toBeCalled();
  });

  it('should be reset when initialDeck is changed', () => {
    const firstDeck = testEnglishDeck(0);
    const { rerender } = renderWithTestRoots(
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
