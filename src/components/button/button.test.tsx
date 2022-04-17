import React from 'react';
import { Button } from './button';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { noop } from '../../helpers/func';

const TEST_CHILDREN = 'TEST_CHILDREN';

describe('Button', () => {
  it('should render correctly with default props', () => {
    render(<Button onClick={noop}>{TEST_CHILDREN}</Button>);
    expect(screen.queryByText(TEST_CHILDREN)).toBeInTheDocument();
  });

  it('should fire onClick when pressed', () => {
    const mockOnClick = jest.fn();
    render(<Button onClick={mockOnClick}>{TEST_CHILDREN}</Button>);

    userEvent.click(screen.getByText(TEST_CHILDREN));
    expect(mockOnClick).toBeCalled();
  });

  it('should not propagate when `bubbleOnClickEvent` is false', () => {
    const mockOnClickOuter = jest.fn();
    const mockOnClickInner = jest.fn();
    render(
      <div onClick={mockOnClickOuter}>
        <Button onClick={mockOnClickInner} bubbleOnClickEvent={false}>
          {TEST_CHILDREN}
        </Button>
      </div>
    );

    userEvent.click(screen.getByText(TEST_CHILDREN));
    expect(mockOnClickOuter).not.toBeCalled();
    expect(mockOnClickInner).toBeCalled();
  });
});
