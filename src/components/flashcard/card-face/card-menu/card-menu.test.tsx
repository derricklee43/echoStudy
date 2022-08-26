import React from 'react';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CardMenu } from './card-menu';
import { noop } from '../../../../helpers/func';

describe('CardMenu', () => {
  const TEST_CHANGE_LANGUAGE_LABEL = 'TEST_CHANGE_LANGUAGE_LABEL';
  const TEST_SWAP_CONTENT_LABEL = 'TEST_SWAP_CONTENT_LABEL';
  const DEFAULT_TEST_LANGUAGE = 'English';

  beforeEach(() => {});

  it('should rended with expected elements', () => {
    render(
      <CardMenu
        language={DEFAULT_TEST_LANGUAGE}
        changeLanguageLabel={TEST_CHANGE_LANGUAGE_LABEL}
        swapContentLabel={TEST_SWAP_CONTENT_LABEL}
        onLanguageChange={noop}
        onSwapContentClick={noop}
      />
    );
    expect(screen.getByRole('button', { name: 'kebab-menu' })).toBeInTheDocument();
    expect(screen.queryByText(TEST_CHANGE_LANGUAGE_LABEL)).not.toBeInTheDocument();
    expect(screen.queryByText(TEST_SWAP_CONTENT_LABEL)).not.toBeInTheDocument();
    expect(screen.queryByText(DEFAULT_TEST_LANGUAGE)).not.toBeInTheDocument();
  });

  it('should open on kebab-menu click', () => {
    render(
      <CardMenu
        language={DEFAULT_TEST_LANGUAGE}
        changeLanguageLabel={TEST_CHANGE_LANGUAGE_LABEL}
        swapContentLabel={TEST_SWAP_CONTENT_LABEL}
        onLanguageChange={noop}
        onSwapContentClick={noop}
      />
    );
    userEvent.click(screen.getByRole('button', { name: 'kebab-menu' }));
    expect(screen.queryByText(TEST_CHANGE_LANGUAGE_LABEL)).toBeInTheDocument();
    expect(screen.queryByText(TEST_SWAP_CONTENT_LABEL)).toBeInTheDocument();
    expect(screen.queryByText(DEFAULT_TEST_LANGUAGE)).toBeInTheDocument();
  });

  it('should close on kebab-menu re-click', async () => {
    render(
      <CardMenu
        language={DEFAULT_TEST_LANGUAGE}
        changeLanguageLabel={TEST_CHANGE_LANGUAGE_LABEL}
        swapContentLabel={TEST_SWAP_CONTENT_LABEL}
        onLanguageChange={noop}
        onSwapContentClick={noop}
      />
    );
    userEvent.click(screen.getByRole('button', { name: 'kebab-menu' }));
    expect(screen.queryByText(TEST_CHANGE_LANGUAGE_LABEL)).toBeInTheDocument();
    expect(screen.queryByText(TEST_SWAP_CONTENT_LABEL)).toBeInTheDocument();
    expect(screen.queryByText(DEFAULT_TEST_LANGUAGE)).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: 'kebab-menu' }));
    await waitForElementToBeRemoved(() => screen.queryByText(TEST_CHANGE_LANGUAGE_LABEL), {
      timeout: 500, // wrt `Fade` having transition duration of 0.2 (200ms)
    });
    expect(screen.queryByText(TEST_CHANGE_LANGUAGE_LABEL)).not.toBeInTheDocument();
    expect(screen.queryByText(TEST_SWAP_CONTENT_LABEL)).not.toBeInTheDocument();
    expect(screen.queryByText(DEFAULT_TEST_LANGUAGE)).not.toBeInTheDocument();
  });

  it('should call onSwapContentClick on swap content click', () => {
    const mockOnSwapContentClick = jest.fn<void, []>();
    render(
      <CardMenu
        language={DEFAULT_TEST_LANGUAGE}
        changeLanguageLabel={TEST_CHANGE_LANGUAGE_LABEL}
        swapContentLabel={TEST_SWAP_CONTENT_LABEL}
        onLanguageChange={noop}
        onSwapContentClick={mockOnSwapContentClick}
      />
    );
    userEvent.click(screen.getByRole('button', { name: 'kebab-menu' }));
    userEvent.click(screen.getByText(TEST_SWAP_CONTENT_LABEL));
  });
});