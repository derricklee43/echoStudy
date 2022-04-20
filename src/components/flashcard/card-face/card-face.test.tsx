import React from 'react';
import { render, screen } from '@testing-library/react';
import { CardFace } from './card-face';
import { getTestMonkeyFront } from '../../../models/mock/card-content.mock';
import { createNewCardContent } from '../../../models/card-content';
import userEvent from '@testing-library/user-event';

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

  it('should render placeholder when text is empty', () => {
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
        placeholder={TEST_PLACEHOLDER}
        onChange={mockOnChange}
      />
    );
    userEvent.type(screen.getByPlaceholderText(TEST_PLACEHOLDER), 't');
    expect(mockOnChange).toBeCalledWith({ ...createNewCardContent(), text: 't' });
  });
});
