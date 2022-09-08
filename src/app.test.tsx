import React from 'react';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { createMemoryHistory, History } from 'history';
import { MutableSnapshot, RecoilRoot } from 'recoil';
import { initRecoilState } from './state/init';
import App from './app';

export function renderWithTestRoots(
  jsxElement: JSX.Element,
  options?: {
    recoilState?: (snapshot: MutableSnapshot) => void;
    route?: string;
    history?: History;
  }
) {
  // set up defaults
  const recoilState = options?.recoilState ?? initRecoilState;
  const route = options?.route ?? '/';
  const history = options?.history ?? createMemoryHistory({ initialEntries: [route] });
  const defaultOptions = { recoilState, route, history };

  const renderResult = render(withTestRoots(jsxElement, defaultOptions));

  // unfortunately, test roots need to be provided again on rerenders
  const rerender = (rerenderElement: JSX.Element) =>
    renderResult.rerender(withTestRoots(rerenderElement, defaultOptions));

  return {
    ...renderResult,
    rerender,
    history,
  };
}

export function withTestRoots(
  jsxElement: JSX.Element | React.ReactNode,
  options?: {
    recoilState?: (snapshot: MutableSnapshot) => void;
    route?: string;
    history?: History;
  }
) {
  const recoilState = options?.recoilState ?? initRecoilState;
  const route = options?.route ?? '/';
  const history = options?.history ?? createMemoryHistory({ initialEntries: [route] });

  return (
    <HistoryRouter history={history}>
      <RecoilRoot initializeState={recoilState}>{jsxElement}</RecoilRoot>
    </HistoryRouter>
  );
}

test('renders App', () => {
  const { container } = renderWithTestRoots(<App />);
  const selector = container.querySelector('.App');
  expect(selector).toBeTruthy();
});
