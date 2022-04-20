import React from 'react';
import { render, screen } from '@testing-library/react';
import { Flashcard } from './flashcard';
import { getTestFoxCard } from '../../models/mock/card.mock';
import { createNewCard } from '../../models/card';

describe('Flashcard', () => {
  it('should render correctly when readonly', () => {
    const testCard = getTestFoxCard();
    render(<Flashcard variant="readonly" card={testCard} />);
    expect(screen.queryByDisplayValue(testCard.front.text)).toBeInTheDocument();
    expect(screen.queryByDisplayValue(testCard.back.text)).toBeInTheDocument();
    expect(screen.queryAllByRole('button', { name: 'speaker' }).length).toEqual(2);
    expect(screen.queryAllByRole('button', { name: 'kebab-menu' }).length).toEqual(0);
    expect(screen.queryByRole('button', { name: 'up-arrow' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'down-arrow' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'trash' })).not.toBeInTheDocument();
  });

  it('should show arrows and trash when not readonly (editable)', () => {
    const testCard = getTestFoxCard();
    render(<Flashcard variant="active" card={testCard} />);
    expect(screen.queryByRole('button', { name: 'up-arrow' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'down-arrow' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'trash' })).toBeInTheDocument();
  });

  it('should show placeholder when card is empty', () => {
    render(<Flashcard variant="active" card={createNewCard()} />);
    expect(screen.queryByPlaceholderText('add term')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('add definition')).toBeInTheDocument();
  });
});
