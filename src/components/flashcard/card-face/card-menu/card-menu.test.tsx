import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { noop } from '@/helpers/func';
import { CardContent, createNewCardContent } from '@/models/card-content';
import { CardMenu } from './card-menu';

describe('CardMenu', () => {
  const FRONT_CHANGE_LANGUAGE_LABEL = 'term language';
  const FRONT_SWAP_CONTENT_LABEL = 'swap with definition';
  const DEFAULT_TEST_LANGUAGE = 'English';

  let cardContent: CardContent;

  beforeEach(() => {
    cardContent = createNewCardContent();
    cardContent.language = DEFAULT_TEST_LANGUAGE;
  });

  it('should rended with expected elements', () => {
    render(
      <CardMenu
        cardContent={cardContent}
        cardSide={'front'}
        onCardContentChange={noop}
        onSwapContentClick={noop}
        onRecordAudioClick={noop}
      />
    );
    expect(screen.getByRole('button', { name: 'kebab-menu' })).toBeInTheDocument();
    expect(screen.queryByText(FRONT_CHANGE_LANGUAGE_LABEL)).not.toBeInTheDocument();
    expect(screen.queryByText(FRONT_SWAP_CONTENT_LABEL)).not.toBeInTheDocument();
    expect(screen.queryByText(DEFAULT_TEST_LANGUAGE)).not.toBeInTheDocument();
  });
  it('should open on kebab-menu click', () => {
    render(
      <CardMenu
        cardContent={cardContent}
        cardSide={'front'}
        onCardContentChange={noop}
        onSwapContentClick={noop}
        onRecordAudioClick={noop}
      />
    );
    userEvent.click(screen.getByRole('button', { name: 'kebab-menu' }));
    expect(screen.queryByText(FRONT_CHANGE_LANGUAGE_LABEL)).toBeInTheDocument();
    expect(screen.queryByText(FRONT_SWAP_CONTENT_LABEL)).toBeInTheDocument();
    expect(screen.queryByText(DEFAULT_TEST_LANGUAGE)).toBeInTheDocument();
  });
  it('should call onSwapContentClick on swap content click', () => {
    const mockOnSwapContentClick = jest.fn<void, []>();
    render(
      <CardMenu
        cardContent={cardContent}
        cardSide={'front'}
        onCardContentChange={noop}
        onSwapContentClick={mockOnSwapContentClick}
        onRecordAudioClick={noop}
      />
    );
    userEvent.click(screen.getByRole('button', { name: 'kebab-menu' }));
    userEvent.click(screen.getByText(FRONT_SWAP_CONTENT_LABEL));
    expect(mockOnSwapContentClick).toHaveBeenCalled();
  });
  it('should call onLanguageChange on language change', () => {
    const mockOnLanguageChange = jest.fn<void, []>();
    render(
      <CardMenu
        cardContent={cardContent}
        cardSide={'front'}
        onCardContentChange={mockOnLanguageChange}
        onSwapContentClick={noop}
        onRecordAudioClick={noop}
      />
    );
    userEvent.click(screen.getByRole('button', { name: 'kebab-menu' }));
    userEvent.click(screen.getByText(DEFAULT_TEST_LANGUAGE));
    userEvent.click(screen.getByText('Spanish'));
    const expectedContentCard = { ...createNewCardContent(), language: 'Spanish' };
    expect(mockOnLanguageChange).toHaveBeenCalledWith(expectedContentCard);
  });
});
