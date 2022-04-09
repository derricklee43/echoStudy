import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { CancelIcon } from '../../assets/icons/cancel-icon/cancel-icon';
import { useOutsideClick } from '../../hooks/use-outside-click';
import './popup-modal.scss';

export interface PopupModalProps {
  children: React.ReactNode;
  headerLabel?: React.ReactNode;
  showTrigger: boolean;
  outsideClickFiresOnClose?: boolean;
  onClose: () => void;
}

export const PopupModal = ({
  children,
  headerLabel,
  showTrigger,
  outsideClickFiresOnClose = false,
  onClose,
}: PopupModalProps) => {
  const contentRef = useRef(null);
  const iconRef = useRef(null);
  useOutsideClick(contentRef, () => onClose(), outsideClickFiresOnClose);

  return ReactDOM.createPortal(
    <>
      <div className={`c-popup-modal-overlay ${showTrigger ? 'visible' : 'hidden'}`}>
        <div className="c-popup-modal-content" ref={contentRef}>
          <div className="c-popup-modal-header">
            {headerLabel}
            <div ref={iconRef}>
              <CancelIcon variant="dark" onClick={onClose} />
            </div>
          </div>
          {children}
        </div>
      </div>
    </>,
    document.getElementById('portal') as HTMLElement
  );
};
