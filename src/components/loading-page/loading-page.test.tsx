import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { LoadingPage } from './loading-page';

const TEST_LABEL = 'TEST_LABEL';

describe('LoadingPage', () => {
  it('should render correctly with default props', () => {
    render(<LoadingPage />);
    expect(document.querySelector('.c-loading-icon')).toBeTruthy();
  });

  it('should show label after delay', async () => {
    render(<LoadingPage label={TEST_LABEL} labelDelay={0.05} />); // 50 ms
    expect(screen.queryByText(TEST_LABEL)).not.toBeVisible();

    await waitFor(() => expect(screen.queryByText(TEST_LABEL)).toBeVisible(), { timeout: 500 });
  });
});
