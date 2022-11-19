import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { noop } from '@/helpers/func';
import { createNewCardContent } from '@/models/card-content';
import { CardFace } from './card-face';

describe('CardFace', () => {
  const FRONT_PLACEHOLDER = 'add term';
  const FRONT_SWAP_CONTENT_LABEL = 'swap with definition';
  const FRONT_CHANGE_LANGUAGE_LABEL = 'term language';

  it('should hide kebab menu when inactive', () => {
    render(
      <CardFace
        cardContent={createNewCardContent()}
        variant="inactive"
        cardSide={'front'}
        onChange={noop}
        onFocus={noop}
        onSwapContentClick={noop}
        onRecordAudioClick={noop}
      />
    );
    expect(screen.queryByRole('button', { name: 'speaker' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'kebab-menu' })).not.toBeInTheDocument();
  });

  it('should hide speaker and show kebab menu when active', () => {
    render(
      <CardFace
        cardContent={createNewCardContent()}
        variant="active"
        cardSide={'front'}
        onChange={noop}
        onFocus={noop}
        onSwapContentClick={noop}
        onRecordAudioClick={noop}
      />
    );
    expect(screen.queryByRole('button', { name: 'speaker' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'kebab-menu' })).toBeInTheDocument();
  });

  it('should render placeholder when text is empty ', () => {
    render(
      <CardFace
        cardContent={createNewCardContent()}
        variant="inactive"
        cardSide={'front'}
        onChange={noop}
        onFocus={noop}
        onSwapContentClick={noop}
        onRecordAudioClick={noop}
      />
    );
    expect(screen.queryByPlaceholderText(FRONT_PLACEHOLDER)).toBeInTheDocument();
  });

  it('should call onFocus on focus', () => {
    const mockOnFocus = jest.fn();
    render(
      <CardFace
        cardContent={createNewCardContent()}
        variant="inactive"
        cardSide={'front'}
        onFocus={mockOnFocus}
        onChange={noop}
        onSwapContentClick={noop}
        onRecordAudioClick={noop}
      />
    );
    userEvent.click(screen.getByPlaceholderText(FRONT_PLACEHOLDER));
    expect(mockOnFocus).toBeCalled();
  });

  it('should call onChange on text change', () => {
    const mockOnChange = jest.fn();
    render(
      <CardFace
        cardContent={createNewCardContent()}
        variant="active"
        onChange={mockOnChange}
        cardSide={'front'}
        onFocus={noop}
        onSwapContentClick={noop}
        onRecordAudioClick={noop}
      />
    );
    userEvent.type(screen.getByPlaceholderText(FRONT_PLACEHOLDER), 't');
    expect(mockOnChange).toBeCalledWith({ ...createNewCardContent(), text: 't' });
  });

  it('should open the card-face menu on click', () => {
    const cardContent = createNewCardContent();
    render(
      <CardFace
        cardContent={cardContent}
        variant="active"
        onChange={noop}
        cardSide={'front'}
        onFocus={noop}
        onSwapContentClick={noop}
        onRecordAudioClick={noop}
      />
    );

    userEvent.click(screen.getByRole('button', { name: 'kebab-menu' }));
    expect(screen.queryByText(FRONT_CHANGE_LANGUAGE_LABEL)).toBeInTheDocument();
    expect(screen.queryByText(FRONT_SWAP_CONTENT_LABEL)).toBeInTheDocument();
    expect(screen.queryByText(cardContent.language)).toBeInTheDocument();
  });
});
