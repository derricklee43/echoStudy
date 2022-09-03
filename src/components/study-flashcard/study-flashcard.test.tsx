import React from 'react';
import { render, screen } from '@testing-library/react';
import { StudyFlashcard } from './study-flashcard';

describe('StudyFlashcard', () => {
  it('should should only front content when active side is front', () => {
    const FRONT_CONTENT = 'FRONT_CONTENT';
    const FRONT_LABEL = 'FRONT_LABEL';
    const BACK_CONTENT = 'BACK_CONTENT';
    const BACK_LABEL = 'BACK_LABEL';
    render(
      <StudyFlashcard
        frontContent={FRONT_CONTENT}
        frontLabel={FRONT_LABEL}
        backContent={BACK_CONTENT}
        backLabel={BACK_LABEL}
        id={FRONT_CONTENT}
        activeSide="front"
        variant="light"
      />
    );
    expect(screen.queryByText(FRONT_CONTENT)).toBeInTheDocument();
    expect(screen.queryByText(FRONT_LABEL)).toBeInTheDocument();
    expect(screen.queryByText(BACK_CONTENT)).toBeInTheDocument();
    expect(screen.queryByText(BACK_LABEL)).toBeInTheDocument();
  });
});
