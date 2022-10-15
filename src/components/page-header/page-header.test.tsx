import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { noop } from '@/helpers/func';
import { PageHeader } from './page-header';

const TEST_LABEL = 'TEST_LABEL';
const TEST_GO_BACK_LABEL = 'TEST_GO_BACK_LABEL';

describe('PageHeader', () => {
  it('should render correctly with default props', () => {
    render(<PageHeader label={TEST_LABEL} />);
    expect(screen.queryByText(TEST_LABEL)).toBeInTheDocument();
  });
});
