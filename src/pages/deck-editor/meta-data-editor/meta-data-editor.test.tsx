import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { testEnglishDeck } from '../../../models/mock/deck.mock';
import { MetaDataEditor } from './meta-data-editor';
import { noop } from '../../../helpers/func';

describe('MetaDataEditor', () => {
  it('should render correctly with default props', () => {
    const testDeck = testEnglishDeck(1);
    render(<MetaDataEditor deck={testDeck} onDeckChange={noop} onDeleteClick={noop} />);
    expect(screen.queryByText('import cards')).toBeInTheDocument();
    expect(screen.queryByText('export deck')).toBeInTheDocument();
    expect(screen.queryByText('advanced settings')).toBeInTheDocument();
    expect(screen.queryByDisplayValue(testDeck.title)).toBeInTheDocument();
    expect(screen.queryByDisplayValue(testDeck.desc)).toBeInTheDocument();
  });

  it('should hide advanced settings until dropdown is clicked', () => {
    const testDeck = testEnglishDeck(1);
    render(<MetaDataEditor deck={testDeck} onDeckChange={noop} onDeleteClick={noop} />);

    expect(screen.queryByText('default term language')).not.toBeInTheDocument();
    expect(screen.queryByText('default definition language')).not.toBeInTheDocument();

    userEvent.click(screen.getByText('advanced settings'));

    expect(screen.queryByText('default term language')).toBeInTheDocument();
    expect(screen.queryByText('default definition language')).toBeInTheDocument();
  });

  it('should call onDeckChange when meta data is changed', () => {
    const testDeck = testEnglishDeck(1);
    const mockOnDeckChange = jest.fn();
    render(<MetaDataEditor deck={testDeck} onDeckChange={mockOnDeckChange} onDeleteClick={noop} />);
    userEvent.type(screen.getByDisplayValue(testDeck.title), 't');
    expect(mockOnDeckChange).toHaveBeenCalled();
  });

  it('should call onDeckChange when meta data is changed', () => {
    const testDeck = testEnglishDeck(1);
    const mockOnDeleteClick = jest.fn();
    render(
      <MetaDataEditor deck={testDeck} onDeckChange={noop} onDeleteClick={mockOnDeleteClick} />
    );
    userEvent.click(screen.getByText('advanced settings'));
    userEvent.click(screen.getByText('delete deck'));

    expect(mockOnDeleteClick).toHaveBeenCalled();
  });
});
