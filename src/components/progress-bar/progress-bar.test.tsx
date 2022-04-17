import React from 'react';
import { ProgressBar } from './progress-bar';
import { render, screen } from '@testing-library/react';

const TEST_LABEL = 'TEST_LABEL';

describe('ProgressBar', () => {
  it('should render correctly with default props', () => {
    render(<ProgressBar percent={50} label={TEST_LABEL} />);
    expect(screen.queryByText(TEST_LABEL)).toBeInTheDocument();
  });

  it('should not render percentage bar if 0%', () => {
    const { container } = render(<ProgressBar percent={0} label={TEST_LABEL} />);
    expect(container.getElementsByClassName('c-inner-bar').length).toBe(0);
  });

  it('should be filled in half-way when set to 50%', () => {
    const { container } = render(<ProgressBar percent={50} label={TEST_LABEL} />);
    expect(container.getElementsByClassName('c-inner-bar').length).toBe(1);
    expect(container.getElementsByClassName('c-inner-bar')[0]).toHaveStyle({ width: '50%' });
  });
});
