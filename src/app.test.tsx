import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './app';
import { BrowserRouter } from 'react-router-dom';

test('renders learn react link', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const linkElement = screen.getByPlaceholderText(/search my decks/i);
  expect(linkElement).toBeInTheDocument();
});
