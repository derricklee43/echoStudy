import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTestRoots } from '@/app.test';
import { noop } from '@/helpers/func';
import { assertIsTruthy } from '@/helpers/test';
import { AudioControlBar } from './audio-control-bar';

describe('AudioControlBar', () => {
  beforeEach(() => {
    // setup portal element for modal to render on
    document.body.innerHTML = `<div id="portal"></div>`;
  });

  it('should render with the expected elements', () => {
    renderWithTestRoots(
      <AudioControlBar
        onNextClick={noop}
        onPauseClick={noop}
        onPlayClick={noop}
        onPreviousClick={noop}
        isPaused={true}
      />
    );
    expect(screen.queryByRole('button', { name: 'play' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'pause' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'next' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'previous' })).toBeInTheDocument();
  });

  it('should swap the play button for the pause button when not pause', () => {
    renderWithTestRoots(
      <AudioControlBar
        onNextClick={noop}
        onPauseClick={noop}
        onPlayClick={noop}
        onPreviousClick={noop}
        isPaused={false}
      />
    );
    expect(screen.queryByRole('button', { name: 'play' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'pause' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'next' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'previous' })).toBeInTheDocument();
  });

  it('should call onNextClick, onPreviousClick,  and onPlayClick when their respective buttons are clicked', () => {
    const mockOnNextClick = jest.fn<void, []>();
    const mockOnPreviousClick = jest.fn<void, []>();
    const mockOnPlayClick = jest.fn<void, []>();
    const mockOnPauseClick = jest.fn<void, []>();
    const { rerender } = renderWithTestRoots(
      <AudioControlBar
        onNextClick={mockOnNextClick}
        onPauseClick={mockOnPauseClick}
        onPlayClick={mockOnPlayClick}
        onPreviousClick={mockOnPreviousClick}
        isPaused={true}
      />
    );
    userEvent.click(screen.getByRole('button', { name: 'play' }));
    expect(mockOnPlayClick).toHaveBeenCalled();

    userEvent.click(screen.getByRole('button', { name: 'next' }));
    expect(mockOnNextClick).toHaveBeenCalled();

    userEvent.click(screen.getByRole('button', { name: 'previous' }));
    expect(mockOnPreviousClick).toHaveBeenCalled();

    rerender(
      <AudioControlBar
        onNextClick={mockOnNextClick}
        onPauseClick={mockOnPauseClick}
        onPlayClick={mockOnPlayClick}
        onPreviousClick={mockOnPreviousClick}
        isPaused={false}
      />
    );

    userEvent.click(screen.getByRole('button', { name: 'pause' }));
    expect(mockOnPreviousClick).toHaveBeenCalled();
  });

  it('should change global Howler volume when slider changed', async () => {
    renderWithTestRoots(
      <AudioControlBar
        onNextClick={noop}
        onPauseClick={noop}
        onPlayClick={noop}
        onPreviousClick={noop}
        isPaused={false}
      />
    );

    const container = document.querySelector('.c-audio-control-bar');
    const volumeSlider = container?.querySelector('input[type="range"]');
    assertIsTruthy(volumeSlider);

    // change slider and ensure Howler volume changes with it
    for (const volume of [0, 25, 50, 75, 100]) {
      // await is intentional, we want to expect on next microtask to ensure state is changed
      await fireEvent.change(volumeSlider, { target: { value: volume } });
      expect(Howler.volume()).toBe(volume / 100);
    }
  });
});
