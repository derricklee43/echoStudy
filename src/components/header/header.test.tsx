import React from 'react';
import { Header } from './header';
import { render, screen } from '@testing-library/react';

describe('Header', () => {
  it('should render correctly with default props', () => {
    render(<Header decks={[]} />);
    expect(screen.queryByText('sign up')).toBeInTheDocument();
    expect(screen.queryByText('sign in')).toBeInTheDocument();
  });

  // todo: test sign up, sign in button functionality when hooked up
});
