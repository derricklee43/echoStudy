import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import { CancelIcon } from '@/assets/icons/cancel-icon/cancel-icon';
import { useFocusFirst } from '@/hooks/use-focus-first';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { useEscapePress } from '@/hooks/use-key-press';
import { useOutsideClick } from '@/hooks/use-outside-click';
import './popup-modal.scss';

export interface PopupModalProps {
  children: React.ReactNode;
  headerLabel?: React.ReactNode;
  showTrigger: boolean;
  outsideClickFiresOnClose?: boolean;
  escapeFiresOnClose?: boolean;
  onClose: () => void;
}

export const PopupModal = ({
  children,
  headerLabel = '',
  showTrigger,
  outsideClickFiresOnClose = false,
  escapeFiresOnClose = true,
  onClose,
}: PopupModalProps) => {
  // handle clicking outside modal if `outsideClickFiresOnClose` is enabled
  const contentRef = useRef<HTMLDivElement>(null);

  useOutsideClick(contentRef, () => onClose(), showTrigger && outsideClickFiresOnClose);
  useFocusTrap(contentRef, showTrigger); // trap accessibility controls (i.e. tabbing) in the content
  useFocusFirst(contentRef, showTrigger); // accessibility: auto-focus the first focusable element (if any)
  useEscapePress(() => onClose(), showTrigger && escapeFiresOnClose);

  // render onto <div id="portal"></div> instead of in parent hierarchy but still propagate events
  return ReactDOM.createPortal(
    <>
      <div className={`c-popup-modal-overlay ${showTrigger ? 'visible' : 'hidden'}`}>
        <div className="c-popup-modal-content" ref={contentRef}>
          <div className="c-popup-modal-header">
            <span>{headerLabel}</span>
            <CancelIcon className="c-popup-modal-cancel-icon" variant="dark" onClick={onClose} />
          </div>
          {children}
        </div>
      </div>
    </>,
    document.getElementById('portal') as HTMLElement
  );
};
