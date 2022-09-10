import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from './progress-bar';

const TEST_LABEL = 'TEST_LABEL';

describe('ProgressBar', () => {
  it('should render correctly with default props', () => {
    render(<ProgressBar variant="white" percent={50} label={TEST_LABEL} />);
    expect(screen.queryByText(TEST_LABEL)).toBeInTheDocument();
  });

  it('should be filled in half-way when set to 50%', () => {
    const { container } = render(<ProgressBar variant="white" percent={50} label={TEST_LABEL} />);
    expect(container.getElementsByClassName('c-inner-bar').length).toBe(1);
    expect(container.getElementsByClassName('c-inner-bar')[0]).toHaveStyle({ width: '50%' });
  });
});
