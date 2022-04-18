import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './app';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { createMemoryHistory } from 'history';

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
