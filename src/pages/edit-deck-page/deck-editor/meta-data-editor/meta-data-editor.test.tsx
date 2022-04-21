import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { testEnglishDeck } from '../../../../models/mock/deck.mock';
import { MetaDataEditor } from './meta-data-editor';
import { noop } from '../../../../helpers/func';

describe('MetaDataEditor', () => {
  beforeEach(() => {
    // setup portal element for modal to render on
    document.body.innerHTML = `<div id="portal"></div>`;
  });

  it('should render correctly with default props', () => {
    const { metaData } = testEnglishDeck(1);
    render(
      <MetaDataEditor
        deckMetaData={metaData}
        onDeckMetaDataChange={noop}
        onDeleteClick={noop}
        onImportedCardsAdd={noop}
      />
    );
    expect(screen.queryAllByText('import cards').length).toEqual(2);
    expect(screen.queryByText('export deck')).toBeInTheDocument();
    expect(screen.queryByText('advanced settings')).toBeInTheDocument();
    expect(screen.queryByDisplayValue(metaData.title)).toBeInTheDocument();
    expect(screen.queryByDisplayValue(metaData.desc)).toBeInTheDocument();
  });

  it('should hide advanced settings until dropdown is clicked', () => {
    const { metaData } = testEnglishDeck(1);
    render(
      <MetaDataEditor
        deckMetaData={metaData}
        onDeckMetaDataChange={noop}
        onDeleteClick={noop}
        onImportedCardsAdd={noop}
      />
    );

    expect(screen.queryByText('default term language')).not.toBeInTheDocument();
    expect(screen.queryByText('default definition language')).not.toBeInTheDocument();

    userEvent.click(screen.getByText('advanced settings'));

    expect(screen.queryByText('default term language')).toBeInTheDocument();
    expect(screen.queryByText('default definition language')).toBeInTheDocument();
  });

  it('should call onDeckChange when meta data is changed', () => {
    const { metaData } = testEnglishDeck(1);
    const mockOnDeckChange = jest.fn();
    render(
      <MetaDataEditor
        deckMetaData={metaData}
        onDeckMetaDataChange={mockOnDeckChange}
        onDeleteClick={noop}
        onImportedCardsAdd={noop}
      />
    );
    userEvent.type(screen.getByDisplayValue(metaData.title), 't');
    expect(mockOnDeckChange).toBeCalled();
  });

  it('should call onDeckChange when meta data is changed', () => {
    const { metaData } = testEnglishDeck(1);
    const mockOnDeleteClick = jest.fn();
    render(
      <MetaDataEditor
        deckMetaData={metaData}
        onDeckMetaDataChange={noop}
        onDeleteClick={mockOnDeleteClick}
        onImportedCardsAdd={noop}
      />
    );
    userEvent.click(screen.getByText('advanced settings'));
    userEvent.click(screen.getByText('delete deck'));

    expect(mockOnDeleteClick).toBeCalled();
  });
});
