import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CardFace } from './card-face';
import { noop } from '../../../helpers/func';
import { createNewCardContent } from '../../../models/card-content';
import { getTestMonkeyFront } from '../../../models/mock/card-content.mock';

describe('CardFace', () => {
  it('should render correctly when readonly', () => {
    const testCardContent = getTestMonkeyFront();
    render(<CardFace cardContent={testCardContent} variant="readonly" />);
    expect(screen.queryByDisplayValue(testCardContent.text)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'speaker' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'kebab-menu' })).not.toBeInTheDocument();
  });

  it('should hide both speaker and kebab menu when inactive', () => {
    render(<CardFace cardContent={createNewCardContent()} variant="inactive" />);
    expect(screen.queryByRole('button', { name: 'speaker' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'kebab-menu' })).not.toBeInTheDocument();
  });

  it('should hide speaker and show kebab menu when active', () => {
    render(<CardFace cardContent={createNewCardContent()} variant="active" />);
    expect(screen.queryByRole('button', { name: 'speaker' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'kebab-menu' })).toBeInTheDocument();
  });

  it('should render placeholder when text is empty ', () => {
    const TEST_PLACEHOLDER = 'TEST_PLACEHOLDER';
    render(
      <CardFace
        cardContent={createNewCardContent()}
        variant="inactive"
        placeholder={TEST_PLACEHOLDER}
      />
    );
    expect(screen.queryByPlaceholderText(TEST_PLACEHOLDER)).toBeInTheDocument();
  });

  it('should call onSpeakerClick on speaker click', () => {
    const mockOnSpeakerClick = jest.fn();
    const content = createNewCardContent();
    content.text = 'TEST_TEXT';
    render(
      <CardFace cardContent={content} variant="readonly" onSpeakerClick={mockOnSpeakerClick} />
    );
    userEvent.click(screen.getByRole('button', { name: 'speaker' }));
    expect(mockOnSpeakerClick).toBeCalled();
  });

  it('should hide placeholder text when readonly', () => {
    const TEST_PLACEHOLDER = 'TEST_PLACEHOLDER';
    render(
      <CardFace
        cardContent={createNewCardContent()}
        variant="readonly"
        placeholder={TEST_PLACEHOLDER}
      />
    );
    expect(screen.queryByPlaceholderText(TEST_PLACEHOLDER)).not.toBeInTheDocument();
  });

  it('should hide speaker when text is empty', () => {
    render(<CardFace cardContent={createNewCardContent()} variant="readonly" />);
    expect(screen.queryByRole('button', { name: 'speaker' })).not.toBeInTheDocument();
  });

  it('should call onFocus on focus', () => {
    const mockOnFocus = jest.fn();
    const TEST_PLACEHOLDER = 'TEST_PLACEHOLDER';
    render(
      <CardFace
        cardContent={createNewCardContent()}
        variant="inactive"
        placeholder={TEST_PLACEHOLDER}
        onFocus={mockOnFocus}
      />
    );
    userEvent.click(screen.getByPlaceholderText(TEST_PLACEHOLDER));
    expect(mockOnFocus).toBeCalled();
  });

  it('should call onChange on text change', () => {
    const mockOnChange = jest.fn();
    const TEST_PLACEHOLDER = 'TEST_PLACEHOLDER';
    render(
      <CardFace
        cardContent={createNewCardContent()}
        variant="active"
        onChange={mockOnChange}
        placeholder={TEST_PLACEHOLDER}
      />
    );
    userEvent.type(screen.getByPlaceholderText(TEST_PLACEHOLDER), 't');
    expect(mockOnChange).toBeCalledWith({ ...createNewCardContent(), text: 't' });
  });

  it('should open the card-face menu on click', () => {
    const TEST_SWAP_CONTENT_LABEL = 'TEST_SWAP_CONTENT_LABEL';
    const TEST_CHANGE_LANGUAGE_LABEL = 'TEST_CHANGE_LANGUAGE_LABEL';
    const cardContent = createNewCardContent();
    render(
      <CardFace
        cardContent={cardContent}
        variant="active"
        onChange={noop}
        changeLanguageLabel={TEST_CHANGE_LANGUAGE_LABEL}
        swapContentLabel={TEST_SWAP_CONTENT_LABEL}
      />
    );

    userEvent.click(screen.getByRole('button', { name: 'kebab-menu' }));
    expect(screen.queryByText(TEST_CHANGE_LANGUAGE_LABEL)).toBeInTheDocument();
    expect(screen.queryByText(TEST_SWAP_CONTENT_LABEL)).toBeInTheDocument();
    expect(screen.queryByText(cardContent.language)).toBeInTheDocument();
  });
});
