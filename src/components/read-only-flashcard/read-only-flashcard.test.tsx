import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { noop } from '@/helpers/func';
import { getTestMonkeyCard } from '@/models/mock/card.mock';
import { ReadOnlyFlashcard } from './read-only-flashcard';

describe('ReadOnlyFlashcard', () => {
  it('should render correctly when readonly', () => {
    const testCardContent = getTestMonkeyCard();
    render(
      <ReadOnlyFlashcard
        variant="light-blue"
        frontText={testCardContent.front.text}
        backText={testCardContent.back.text}
        onBackSpeakerClick={noop}
        onFrontSpeakerClick={noop}
      />
    );
    expect(screen.queryByText(testCardContent.front.text)).toBeInTheDocument();
    expect(screen.queryByText(testCardContent.back.text)).toBeInTheDocument();
    expect(screen.queryAllByRole('button', { name: 'speaker' })).toHaveLength(2);
  });

  it('should call onSpeakerClick on speaker click', () => {
    const mockOnFrontSpeakerClick = jest.fn();
    const mockOnBackSpeakerClick = jest.fn();
    render(
      <ReadOnlyFlashcard
        variant="light-blue"
        frontText="front"
        backText="back"
        onFrontSpeakerClick={mockOnFrontSpeakerClick}
        onBackSpeakerClick={mockOnBackSpeakerClick}
      />
    );
    const [frontSpeaker, backSpeaker] = screen.getAllByRole('button', { name: 'speaker' });
    userEvent.click(frontSpeaker);
    userEvent.click(backSpeaker);
    expect(mockOnFrontSpeakerClick).toBeCalledTimes(1);
    expect(mockOnBackSpeakerClick).toBeCalledTimes(1);
  });

  it('should hide speaker when text is empty', () => {
    render(
      <ReadOnlyFlashcard
        variant="light-blue"
        frontText=""
        backText=""
        onFrontSpeakerClick={noop}
        onBackSpeakerClick={noop}
      />
    );
    expect(screen.queryAllByRole('button', { name: 'speaker' })).toHaveLength(0);
  });
});
