import React from 'react';
import { render, screen } from '@testing-library/react';
import { Flashcard } from './flashcard';
import { getTestFoxCard } from '../../models/mock/card.mock';
import { createNewCard } from '../../models/card';

describe('Flashcard', () => {
  it('should render correctly when inactive', () => {
    const testCard = getTestFoxCard();
    render(<Flashcard variant="inactive" card={testCard} />);
    expect(screen.queryByDisplayValue(testCard.front.text)).toBeInTheDocument();
    expect(screen.queryByDisplayValue(testCard.back.text)).toBeInTheDocument();
    expect(screen.queryAllByRole('button', { name: 'speaker' }).length).toEqual(0);
    expect(screen.queryAllByRole('button', { name: 'kebab-menu' }).length).toEqual(0);
  });

  it('should render correctly when active', () => {
    const testCard = getTestFoxCard();
    render(<Flashcard variant="active" card={testCard} />);
    expect(screen.queryByDisplayValue(testCard.front.text)).toBeInTheDocument();
    expect(screen.queryByDisplayValue(testCard.back.text)).toBeInTheDocument();
    expect(screen.queryAllByRole('button', { name: 'speaker' }).length).toEqual(0);
    expect(screen.queryAllByRole('button', { name: 'kebab-menu' }).length).toEqual(2);
  });

  it('should render correctly when readonly', () => {
    const testCard = getTestFoxCard();
    render(<Flashcard variant="readonly" card={testCard} />);
    expect(screen.queryByDisplayValue(testCard.front.text)).toBeInTheDocument();
    expect(screen.queryByDisplayValue(testCard.back.text)).toBeInTheDocument();
    expect(screen.queryAllByRole('button', { name: 'speaker' }).length).toEqual(2);
    expect(screen.queryAllByRole('button', { name: 'kebab-menu' }).length).toEqual(0);
  });

  it('should show placeholder when card is empty', () => {
    render(<Flashcard variant="active" card={createNewCard()} />);
    expect(screen.queryByPlaceholderText('add term')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('add definition')).toBeInTheDocument();
  });
});
