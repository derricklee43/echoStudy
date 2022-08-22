import React from 'react';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { noop } from '../../helpers/func';
import userEvent from '@testing-library/user-event';
import { ImportCardsPopup } from './import-cards-popup';
import { Card } from '../../models/card';

describe('ImportCardsPopup', () => {
  beforeEach(() => {
    // setup portal element for modal to render on
    document.body.innerHTML = `<div id="portal"></div>`;
  });

  it('should render with default elements', () => {
    render(<ImportCardsPopup showPopup={true} onClose={noop} />);
    expect(screen.queryByText('1. what separates the terms and definitions?')).toBeInTheDocument();
    expect(screen.queryByText('2. what separates each card?')).toBeInTheDocument();
    expect(screen.queryByText('3. how to import your cards?')).toBeInTheDocument();
    expect(screen.queryByText('commas')).toBeInTheDocument();
    expect(screen.queryByText('spaces')).toBeInTheDocument();
    expect(screen.queryByText('semicolons')).toBeInTheDocument();
    expect(screen.queryByText('new lines')).toBeInTheDocument();
    expect(screen.queryByText('upload file')).toBeInTheDocument();
    expect(screen.queryByText('copy and paste')).toBeInTheDocument();
    expect(screen.queryByText('import')).toBeInTheDocument();
  });

  it('should disable import button when import config is invalid', () => {
    render(<ImportCardsPopup showPopup={true} onClose={noop} />);
    expect(screen.getByText('import')).toBeDisabled();
  });

  it('should enable import button when import config is valid', () => {
    render(<ImportCardsPopup showPopup={true} onClose={noop} />);
    userEvent.click(screen.getByText('commas'));
    userEvent.click(screen.getByText('new lines'));
    userEvent.click(screen.getByText('copy and paste'));
    userEvent.type(screen.getByPlaceholderText('copy and paste your cards here'), 'test');
    expect(screen.getByText('import')).toBeEnabled();
  });

  it('should show FileInput when upload file is clicked', () => {
    render(<ImportCardsPopup showPopup={true} onClose={noop} />);
    userEvent.click(screen.getByText('upload file'));
    expect(screen.queryByText('choose a file')).toBeInTheDocument();
  });

  it('should import configured cards on import click', () => {
    const mockOnClose: jest.Mock<void, [Card[]]> = jest.fn();
    const cardText = 'a,b;c,d';
    render(<ImportCardsPopup showPopup={true} onClose={mockOnClose} />);
    userEvent.click(screen.getByText('commas'));
    userEvent.click(screen.getByText('semicolons'));
    userEvent.click(screen.getByText('copy and paste'));
    userEvent.type(screen.getByPlaceholderText('copy and paste your cards here'), cardText);
    userEvent.click(screen.getByText('import'));

    const importedCards = mockOnClose.mock.calls[0][0];
    expect(importedCards.length).toEqual(2);
    expect(importedCards[0].front.text).toEqual('a');
    expect(importedCards[0].back.text).toEqual('b');
    expect(importedCards[1].front.text).toEqual('c');
    expect(importedCards[1].back.text).toEqual('d');
  });
});
