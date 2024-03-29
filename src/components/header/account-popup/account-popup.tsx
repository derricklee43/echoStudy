import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { useEscapePress } from '@/hooks/use-key-press';
import { useOutsideClick } from '@/hooks/use-outside-click';
import './account-popup.scss';

export interface AccountPopupProps {
  className?: string;
  fixed?: boolean;
  children: React.ReactNode;
  showTrigger: boolean;
  onClose: () => void;
}

export const AccountPopup = ({
  className = '',
  fixed = false,
  children,
  showTrigger,
  onClose,
}: AccountPopupProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useOutsideClick(contentRef, () => onClose(), showTrigger);
  useFocusTrap(contentRef, showTrigger);
  useEscapePress(() => onClose(), showTrigger);

  const showClass = showTrigger ? 'visible' : 'hidden';
  const fixedClass = fixed ? 'fixed' : '';

  // render onto <div id="portal"></div> instead of in parent hierarchy but still propagate events
  return ReactDOM.createPortal(
    <>
      <div className={`c-account-popup-overlay ${showClass}`}>
        <div className={`c-account-popup-content ${className} ${fixedClass}`} ref={contentRef}>
          {children}
        </div>
      </div>
    </>,
    document.getElementById('portal') as HTMLElement
  );
};
