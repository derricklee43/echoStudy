import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { noop } from '@/helpers/func';
import { testEnglishDeck } from '@/models/mock/deck.mock';
import { MetaDataEditor } from './meta-data-editor';

describe('MetaDataEditor', () => {
  beforeEach(() => {
    // setup portal element for modal to render on
    document.body.innerHTML = `<div id="portal"></div>`;
  });

  it('should render correctly with default props', () => {
    const deck = testEnglishDeck();
    render(
      <MetaDataEditor
        deck={deck}
        onDeckMetaDataChange={noop}
        onDeleteClick={noop}
        onImportedCardsAdd={noop}
        onSwapAllClick={noop}
      />
    );
    expect(screen.queryAllByText('import cards').length).toEqual(2);
    expect(screen.queryByText('export deck')).toBeInTheDocument();
    expect(screen.queryByText('advanced settings')).toBeInTheDocument();
    expect(screen.queryByDisplayValue(deck.metaData.title)).toBeInTheDocument();
    expect(screen.queryByDisplayValue(deck.metaData.desc)).toBeInTheDocument();
  });

  it('should hide advanced settings until dropdown is clicked', () => {
    const deck = testEnglishDeck();
    render(
      <MetaDataEditor
        deck={deck}
        onDeckMetaDataChange={noop}
        onDeleteClick={noop}
        onImportedCardsAdd={noop}
        onSwapAllClick={noop}
      />
    );

    expect(screen.queryByText('default term language')).not.toBeInTheDocument();
    expect(screen.queryByText('default definition language')).not.toBeInTheDocument();

    userEvent.click(screen.getByText('advanced settings'));

    expect(screen.queryByText('default term language')).toBeInTheDocument();
    expect(screen.queryByText('default definition language')).toBeInTheDocument();
  });

  it('should call onDeckChange when meta data is changed', () => {
    const deck = testEnglishDeck();
    const mockOnDeckChange = jest.fn();
    render(
      <MetaDataEditor
        deck={deck}
        onDeckMetaDataChange={mockOnDeckChange}
        onDeleteClick={noop}
        onImportedCardsAdd={noop}
        onSwapAllClick={noop}
      />
    );
    userEvent.type(screen.getByDisplayValue(deck.metaData.title), 't');
    expect(mockOnDeckChange).toBeCalled();
  });

  it('should call onDeleteClick when delete button is clicked', () => {
    const deck = testEnglishDeck();
    const mockOnDeleteClick = jest.fn();
    render(
      <MetaDataEditor
        deck={deck}
        onDeckMetaDataChange={noop}
        onDeleteClick={mockOnDeleteClick}
        onImportedCardsAdd={noop}
        onSwapAllClick={noop}
      />
    );
    userEvent.click(screen.getByText('advanced settings'));
    userEvent.click(screen.getByText('delete deck'));

    expect(mockOnDeleteClick).toBeCalled();
  });
});
