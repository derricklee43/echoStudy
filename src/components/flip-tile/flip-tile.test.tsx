import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FlipTile } from './flip-tile';
import { noop } from '../../helpers/func';

const TEST_FRONT = 'TEST_FRONT';
const TEST_BACK = 'TEST_BACK';
const P_TEST_FRONT = <p>{TEST_FRONT}</p>;
const P_TEST_BACK = <p>{TEST_BACK}</p>;

describe('FlipTile', () => {
  it('should render correctly with default props', () => {
    render(<FlipTile isFlipped={false} front={P_TEST_FRONT} back={P_TEST_BACK} onClick={noop} />);
    expect(screen.queryByText(TEST_FRONT)).toBeInTheDocument();
    expect(screen.queryByText(TEST_BACK)).toBeInTheDocument();
  });

  it('should fire `onClick` when pressed', () => {
    const mockOnClick = jest.fn();
    render(
      <FlipTile isFlipped={false} front={P_TEST_FRONT} back={P_TEST_BACK} onClick={mockOnClick} />
    );
    userEvent.click(screen.getByText(TEST_FRONT));
    expect(mockOnClick).toBeCalled();
  });

  it('should have `is-flipped` class when `isFlipped` is true', () => {
    const { container } = render(
      <FlipTile isFlipped={true} front={P_TEST_FRONT} back={P_TEST_BACK} onClick={noop} />
    );
    expect(container.getElementsByClassName('c-card')[0]).toHaveClass('is-flipped');
  });
});
