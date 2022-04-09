import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { PopupModal, PopupModalProps } from './popup-modal';
import userEvent from '@testing-library/user-event';

const TEST_CHILDREN = 'TEST_CHILDREN';

const MockPopupModalParent = ({
  children,
  headerLabel,
  outsideClickFiresOnClose,
}: Partial<PopupModalProps>) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button data-testid="show-modal-button" onClick={() => setShowModal(true)} />
      <PopupModal
        headerLabel={headerLabel}
        showTrigger={showModal}
        outsideClickFiresOnClose={outsideClickFiresOnClose}
        onClose={() => setShowModal(false)}
      >
        {children}
      </PopupModal>
    </>
  );
};

describe('PopupModal', () => {
  beforeEach(() => {
    // setup portal element for modal to render on
    document.body.innerHTML = `<div id="portal"></div>`;
  });

  it('should render correctly with default props', () => {
    const { container } = render(<MockPopupModalParent />);
    expect(container).toBeInTheDocument();
  });

  it('should open modal when button hooked up with `showTrigger` is clicked', () => {
    render(<MockPopupModalParent />);
    expectModalIsHidden();

    openModal();
    expectModalIsVisible();
  });

  it('should hide modal when close button is clicked', () => {
    render(<MockPopupModalParent />);
    openModal();
    expectModalIsVisible();

    closeModal();
    expectModalIsHidden();
  });

  it('should hide modal when clicking outside with `outsideClickFiresOnClose` enabled', () => {
    render(<MockPopupModalParent outsideClickFiresOnClose={true} />);
    openModal();
    expectModalIsVisible();

    // simulate clicking outside modal
    userEvent.click(document.body);
    expectModalIsHidden();
  });

  it('should render special children props', () => {
    const { rerender } = render(<MockPopupModalParent />);
    openModal();
    expect(getModalContent()).not.toHaveTextContent(TEST_CHILDREN);

    // rerender with children
    rerender(<MockPopupModalParent>{TEST_CHILDREN}</MockPopupModalParent>);
    expect(getModalContent()).toHaveTextContent(TEST_CHILDREN);
  });

  function expectModalIsHidden() {
    const wrapper = document.querySelector('.c-popup-modal-overlay');
    expect(wrapper).toHaveClass('hidden');
  }

  function expectModalIsVisible() {
    const wrapper = document.querySelector('.c-popup-modal-overlay');
    expect(wrapper).toHaveClass('visible');
  }

  function getModalContent() {
    return document.querySelector('.c-popup-modal-content') as HTMLElement;
  }

  function openModal() {
    const button = screen.getByTestId('show-modal-button');
    button.click(); // sets showTrigger to true
  }

  function closeModal() {
    const cancelIcon = document.querySelector('.cancel-icon');
    if (!cancelIcon) fail('Could not find cancel icon to close modal');
    fireEvent.click(cancelIcon);
  }
});
