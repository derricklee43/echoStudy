import React from 'react';
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTestRoots } from '@/app.test';
import { noop } from '@/helpers/func';
import { AccountPopup } from './account-popup';

describe('AccountPopup', () => {
  const DEFAULT_CHILDREN = <div>test123</div>;

  beforeEach(() => {
    // setup portal element for modal to render on
    document.body.innerHTML = `<div id="portal"></div>`;
  });

  it('should render correctly with default props', () => {
    renderWithTestRoots(
      <AccountPopup showTrigger={true} onClose={noop}>
        {DEFAULT_CHILDREN}
      </AccountPopup>
    );
    expectPopupIsVisible();
  });

  it('should hide when show is not triggered', () => {
    renderWithTestRoots(
      <AccountPopup showTrigger={false} onClose={noop}>
        {DEFAULT_CHILDREN}
      </AccountPopup>
    );
    expectPopupIsHidden();
  });

  it('should close itself on outside click', () => {
    const mockOnClose = jest.fn();
    renderWithTestRoots(
      <AccountPopup showTrigger={true} onClose={mockOnClose}>
        {DEFAULT_CHILDREN}
      </AccountPopup>
    );
    expect(mockOnClose).not.toBeCalled();

    // simulate clicking outside modal
    userEvent.click(document.body);
    expect(mockOnClose).toBeCalled();
  });

  it('should close itself on Escape pressed', () => {
    const mockOnClose = jest.fn();
    renderWithTestRoots(
      <AccountPopup showTrigger={true} onClose={mockOnClose}>
        {DEFAULT_CHILDREN}
      </AccountPopup>
    );
    expect(mockOnClose).not.toBeCalled();

    // simulate pressing Escape
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toBeCalled();
  });

  function expectPopupIsHidden() {
    const wrapper = document.querySelector('.c-account-popup-overlay');
    expect(wrapper).toHaveClass('hidden');
  }

  function expectPopupIsVisible() {
    const wrapper = document.querySelector('.c-account-popup-overlay');
    expect(wrapper).toHaveClass('visible');
  }
});
