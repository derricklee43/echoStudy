import React from 'react';
import { PageHeader } from './page-header';
import { render, screen } from '@testing-library/react';
import { noop } from '../../helpers/func';
import userEvent from '@testing-library/user-event';

const TEST_LABEL = 'TEST_LABEL';

describe('PageHeader', () => {
  it('should render correctly with default props', () => {
    render(<PageHeader label={TEST_LABEL} onGoBackClick={noop} />);
    expect(screen.queryByText(TEST_LABEL)).toBeInTheDocument();
  });

  it('should trigger `onGoBackClick` when button pressed', () => {
    const mockOnGoBackClick = jest.fn();
    render(<PageHeader label={TEST_LABEL} onGoBackClick={mockOnGoBackClick} />);

    userEvent.click(screen.getByText('back to decks'));
    expect(mockOnGoBackClick).toBeCalled();
  });
});
