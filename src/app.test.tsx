import React from 'react';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory, History } from 'history';
import { MutableSnapshot, RecoilRoot } from 'recoil';
import { initRecoilState } from './state/init';
import App from './app';

export function renderWithHistoryRouter(
  jsxElement: JSX.Element,
  options?: {
    recoilState?: (snapshot: MutableSnapshot) => void;
    route?: string;
    history?: History;
  }
) {
  const recoilState = options?.recoilState ?? initRecoilState;
  const route = options?.route ?? '/';
  const history = options?.history ?? createMemoryHistory({ initialEntries: [route] });

  return {
    history,
    ...render(
      <HistoryRouter history={history}>
        <RecoilRoot initializeState={recoilState}>{jsxElement}</RecoilRoot>
      </HistoryRouter>
    ),
  };
}

export function renderWithRecoilRoot(
  jsxElement: JSX.Element,
  options?: {
    recoilState?: (snapshot: MutableSnapshot) => void;
  }
) {
  const recoilState = options?.recoilState ?? initRecoilState;
  return render(<RecoilRoot initializeState={recoilState}>{jsxElement}</RecoilRoot>);
}

test('renders App', () => {
  const { container } = renderWithHistoryRouter(<App />);
  const selector = container.querySelector('.App');
  expect(selector).toBeTruthy();
});
