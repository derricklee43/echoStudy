import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './app';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

test('renders learn react link', () => {
  render(
    <BrowserRouter>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </BrowserRouter>
  );
  const linkElement = screen.getByPlaceholderText(/search my decks/i);
  expect(linkElement).toBeInTheDocument();
});
