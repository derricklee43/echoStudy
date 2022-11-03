import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { PopupModal } from '@/components/popup-modal/popup-modal';
import { RangeSlider } from '@/components/range-slider/range-slider';
import { stringToBoolean } from '@/helpers/string';
import { toNumberOrElse } from '@/helpers/validator';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { LocalStorageKeys } from '@/state/init';
import './player-options-popup.scss';

interface PlayerOptionsPopupProps {
  showPopup: boolean;
  onClose: () => void;
}

export const PlayerOptionsPopup = ({ showPopup, onClose }: PlayerOptionsPopupProps) => {
  const ls = useLocalStorage();

  const [pauseLength, setPauseLength] = useState(
    toNumberOrElse(ls.getString(LocalStorageKeys.attemptPauseLength), 5)
  );
  const [advanceOnlyOnAttempt, setAdvanceOnlyOnAttempt] = useState(
    stringToBoolean(ls.getString(LocalStorageKeys.advanceOnlyOnAttempt) ?? 'false')
  );

  // naively update everything if anything changes; could optimize if needed
  useEffect(() => {
    ls.upsert(LocalStorageKeys.attemptPauseLength, pauseLength.toString());
    ls.upsert(LocalStorageKeys.advanceOnlyOnAttempt, advanceOnlyOnAttempt.toString());
  }, [pauseLength, advanceOnlyOnAttempt]);

  return (
    <PopupModal
      headerLabel="Player Options"
      showTrigger={showPopup}
      onClose={onClose}
      outsideClickFiresOnClose={false}
      focusFirst={false}
    >
      <div className="player-options-popup-content">
        <section>
          <div className="player-options-label">card attempt pause length</div>
          <div className="pause-length-container">
            <RangeSlider
              maxValue={30}
              disabled={advanceOnlyOnAttempt}
              value={pauseLength}
              setValue={setPauseLength}
            />
            <div className="player-options-label bold">{getPauseLengthText()}</div>
          </div>
          <div className="advance-only-attempt-container">
            <div className="player-options-label">
              ...or advance only on attempt <span className="bold">(experimental)</span>
            </div>
            <input
              type="checkbox"
              checked={advanceOnlyOnAttempt}
              onChange={(event) => setAdvanceOnlyOnAttempt(event.target.checked)}
            ></input>
          </div>
        </section>

        <hr className="player-options-divider" />

        <section>idk yet</section>
      </div>
    </PopupModal>
  );

  function getPauseLengthText() {
    if (advanceOnlyOnAttempt) {
      return 'n/a';
    }
    return pauseLength == 0 ? 'auto' : `${pauseLength}s`;
  }
};
