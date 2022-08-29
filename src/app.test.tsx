import React from 'react';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { RecoilRoot } from 'recoil';
import App from './app';

export function renderWithHistoryRouter(
  jsxElement: JSX.Element,
  { route = '/', history = createMemoryHistory({ initialEntries: [route] }) } = {}
) {
  return {
    history,
    ...render(<HistoryRouter history={history}>{jsxElement}</HistoryRouter>),
  };
}

test('renders learn react link', () => {
  renderWithHistoryRouter(
    <RecoilRoot>
      <App />
    </RecoilRoot>
  );
  const linkElement = screen.getByPlaceholderText(/search my decks/i);
  expect(linkElement).toBeInTheDocument();
});
