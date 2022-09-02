import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BubbleDivider } from './bubble-divider';

const TEST_LABEL = 'TEST_LABEL';
const TEST_CHILDREN = 'TEST_CHILDREN';

describe('BubbleDivider', () => {
  it('should render correctly with default props', () => {
    render(<BubbleDivider label={TEST_LABEL} variantType="drop-down" children={TEST_CHILDREN} />);
    expect(screen.queryByText(TEST_LABEL)).toBeInTheDocument();
    expect(screen.queryByText(TEST_CHILDREN)).not.toBeInTheDocument();
  });

  it('should show children when variantType is drop-down and is clicked', () => {
    render(<BubbleDivider label={TEST_LABEL} variantType="drop-down" children={TEST_CHILDREN} />);
    clickDropDown();
    expect(screen.queryByText(TEST_CHILDREN)).toBeInTheDocument();
  });

  it('should not show children when variantType is divider and is clicked', () => {
    render(<BubbleDivider label={TEST_LABEL} variantType="divider" children={TEST_CHILDREN} />);
    clickDropDown();
    expect(screen.queryByText(TEST_CHILDREN)).not.toBeInTheDocument();
  });

  function clickDropDown() {
    userEvent.click(screen.getByText(TEST_LABEL));
  }
});
