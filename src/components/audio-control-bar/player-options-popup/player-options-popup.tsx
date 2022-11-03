import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FadeReveal } from '@/animations/fade-reveal';
import { PopupModal } from '@/components/popup-modal/popup-modal';
import { RangeSlider } from '@/components/range-slider/range-slider';
import { stringToBoolean } from '@/helpers/string';
import { toNumberOrElse } from '@/helpers/validator';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { LocalStorageKeys as LSKeys } from '@/state/init';
import './player-options-popup.scss';

interface PlayerOptionsPopupProps {
  showPopup: boolean;
  onClose: () => void;
}

export const PlayerOptionsPopup = ({ showPopup, onClose }: PlayerOptionsPopupProps) => {
  const ls = useLocalStorage();

  // defaults from local storage or fallback
  const defEnableSpeech = stringToBoolean(ls.getString(LSKeys.enableSpeechRecognition), true);
  const defPauseLength = toNumberOrElse(ls.getString(LSKeys.attemptPauseLength), 8);
  const defAdvanceOnlyOnAttempt = stringToBoolean(ls.getString(LSKeys.advanceOnlyOnAttempt), false);
  const defEnableSoundEffects = stringToBoolean(ls.getString(LSKeys.enableSoundEffects), true);

  // player option states
  const [enableSpeechRecognition, setEnableSpeechRecognition] = useState(defEnableSpeech);
  const [pauseLength, setPauseLength] = useState(defPauseLength);
  const [advanceOnlyOnAttempt, setAdvanceOnlyOnAttempt] = useState(defAdvanceOnlyOnAttempt);
  const [enableSoundEffects, setEnableSoundEffects] = useState(defEnableSoundEffects);

  // naively update everything if anything changes; could optimize if needed
  useEffect(() => {
    ls.upsert(LSKeys.enableSpeechRecognition, enableSpeechRecognition.toString());
    ls.upsert(LSKeys.attemptPauseLength, pauseLength.toString());
    ls.upsert(LSKeys.advanceOnlyOnAttempt, advanceOnlyOnAttempt.toString());
    ls.upsert(LSKeys.enableSoundEffects, enableSoundEffects.toString());
  }, [enableSpeechRecognition, pauseLength, advanceOnlyOnAttempt, enableSoundEffects]);

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
          <div className="toggle-container">
            <div className="player-options-label">Speech Recognition</div>
            <input
              type="checkbox"
              checked={enableSpeechRecognition}
              onChange={(event) => setEnableSpeechRecognition(event.target.checked)}
            />
          </div>

          <AnimatePresence exitBeforeEnter>
            {enableSpeechRecognition && (
              <FadeReveal className="enable-speech-recognition-reveal">
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
                <div className="toggle-container">
                  <div className="player-options-label">
                    ...or advance only on attempt <span className="bold">(experimental)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={advanceOnlyOnAttempt}
                    onChange={(event) => setAdvanceOnlyOnAttempt(event.target.checked)}
                  />
                </div>
              </FadeReveal>
            )}
          </AnimatePresence>
        </section>

        <hr className="player-options-divider" />

        <section>
          <div className="toggle-container">
            <div className="player-options-label">Sound Effects</div>
            <input
              type="checkbox"
              checked={enableSoundEffects}
              onChange={(event) => setEnableSoundEffects(event.target.checked)}
            />
          </div>
        </section>
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
