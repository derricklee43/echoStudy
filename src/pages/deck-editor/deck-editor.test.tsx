import React from 'react';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { DeckEditorPage } from './deck-editor';
import userEvent from '@testing-library/user-event';
import Router from 'react-router-dom';

const TEST_LABEL = 'TEST_INITIAL_TEXT';

// Todo: mock the the fetch module

const mockedUseNavigate = jest.fn();
const mockedUseParams = jest.fn().mockReturnValue(() => ({ deckId: -1 }));

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUseNavigate,
  useParams: () => mockedUseParams,
}));

jest.mock('../../hooks/use-prompt');

describe('DeckEditor', () => {
  beforeEach(() => {
    // setup portal element for modal to render on
    document.body.innerHTML = `<div id="portal"></div>`;

    // Todo: update deckId when fetch is fixed
    jest.spyOn(Router, 'useParams').mockReturnValue({ deckId: '' });
  });

  it('should render correctly with default props', () => {
    render(<DeckEditorPage label={TEST_LABEL} />);
    expect(screen.queryByText(TEST_LABEL)).toBeInTheDocument();
    expect(screen.queryByText('save')).toBeInTheDocument();
    expect(screen.queryByText('new card')).toBeInTheDocument();
    expect(screen.queryByText('discard changes')).not.toBeInTheDocument();
    expect(
      screen.queryByText('you currently have no cards. click "+ new card" to get started')
    ).toBeInTheDocument();
  });

  it('should add a new card on click', () => {
    render(<DeckEditorPage label={TEST_LABEL} />);

    userEvent.click(screen.getByText('new card'));

    expect(screen.queryByPlaceholderText('add term')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('add definition')).toBeInTheDocument();
  });

  it('should display discard changes button when deck is not saved', () => {
    render(<DeckEditorPage label={TEST_LABEL} />);
    userEvent.click(screen.getByText('new card'));
    expect(screen.queryByText('discard changes')).toBeInTheDocument();
  });

  it('should call discard changes on discard changes click', () => {
    render(<DeckEditorPage label={TEST_LABEL} />);

    userEvent.click(screen.getByText('new card'));
    expect(screen.queryByPlaceholderText('add term')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('add definition')).toBeInTheDocument();

    userEvent.click(screen.getByText('discard changes'));

    expect(screen.queryByPlaceholderText('add term')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('add definition')).not.toBeInTheDocument();
  });

  it('should hide discard changes button on save', async () => {
    render(<DeckEditorPage label={TEST_LABEL} />);

    userEvent.click(screen.getByText('new card'));

    expect(screen.getByText('discard changes')).toBeInTheDocument();

    userEvent.click(screen.getByText('save'));

    await waitForElementToBeRemoved(() => screen.queryByText('discard changes'));
  });
});
