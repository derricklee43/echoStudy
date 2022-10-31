import React from 'react';
import { PopupModal } from '@/components/popup-modal/popup-modal';
import './player-options-popup.scss';

interface PlayerOptionsPopupProps {
  showPopup: boolean;
  onClose: () => void;
}

export const PlayerOptionsPopup = ({ showPopup, onClose }: PlayerOptionsPopupProps) => {
  return (
    <PopupModal
      headerLabel="Player Options"
      showTrigger={showPopup}
      onClose={onClose}
      outsideClickFiresOnClose={false}
    >
      <div className="player-options-popup-content"></div>
    </PopupModal>
  );
};
