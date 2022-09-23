import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import { CancelIcon } from '../../../assets/icons/cancel-icon/cancel-icon';
import { useFocusFirst } from '../../../hooks/use-focus-first';
import { useFocusTrap } from '../../../hooks/use-focus-trap';
import { useOutsideClick } from '../../../hooks/use-outside-click';
import './account-popup.scss';

export interface AccountPopupProps {
  className?: string;
  children: React.ReactNode;
  showTrigger: boolean;
  outsideClickFiresOnClose?: boolean;
  onClose: () => void;
}

export const AccountPopup = ({
  className = '',
  children,
  showTrigger,
  outsideClickFiresOnClose = false,
  onClose,
}: AccountPopupProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useOutsideClick(contentRef, () => onClose(), outsideClickFiresOnClose);
  useFocusTrap(contentRef, showTrigger);

  const showClass = showTrigger ? 'visible' : 'hidden';

  // render onto <div id="portal"></div> instead of in parent hierarchy but still propagate events
  return ReactDOM.createPortal(
    <>
      <div className={`c-account-popup-overlay ${showClass}`}>
        <div className={`c-account-popup-content ${className}`} ref={contentRef}>
          {children}
        </div>
      </div>
    </>,
    document.getElementById('portal') as HTMLElement
  );
};
