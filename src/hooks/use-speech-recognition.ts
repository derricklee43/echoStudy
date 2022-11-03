import { useRef, useState } from 'react';
import { deferredPromise } from '@/helpers/promise';
import { stringToBoolean } from '@/helpers/string';
import { CapturedSpeech } from '@/models/captured-speech';
import { DeckLanguage, getLanguageCode } from '@/models/language';
import { LocalStorageKeys } from '@/state/init';
import { useLocalStorage } from './use-local-storage';
import { useTimer } from './use-timer';

export function useCaptureSpeech() {
  const ls = useLocalStorage();
  const { setTimer } = useTimer(); // could use setTimeout since we never resume a capture session if paused

  const resumePromiseRef = useRef<ReturnType<typeof deferredPromise>>();
  const speechRecognitionRef = useRef(getSpeechRecognitionObj());
  const [isCapturingSpeech, setIsCapturingSpeech] = useState(false);

  return {
    captureSpeech,
    stopCapturingSpeech,
    abortSpeechCapture,
    resumeSpeechResult,
    hasBrowserSupport,
    isCapturingSpeech,
  };

  /**
   * @returns when promise is resolved, returns the spoken text in lowercase without whitespaces
   */
  async function captureSpeech(language: DeckLanguage, pauseLength: number): Promise<string> {
    // grab player options
    const advanceOnlyOnAttempt = stringToBoolean(
      ls.getString(LocalStorageKeys.advanceOnlyOnAttempt)
    );

    // setup to start capturing speech
    let remainingPauseLength = pauseLength;
    let lastNoSpeechError = Date.now();
    let retryCapture = true;
    let capturedSpeech: CapturedSpeech = { from: 'timeout', transcript: '', confidence: 0 };

    // workaround for speech recognition erroring if no response in ~10 seconds
    // this allows for these invariants:
    //  - resolves after a valid speech (even if pause length hasn't elapsed)
    //  - waits for `attemptPauseLength` seconds or infinite if advance only attempt is set
    while (retryCapture) {
      try {
        if (advanceOnlyOnAttempt) {
          capturedSpeech = await _captureSpeechImpl(language);
          if (['result', 'no-result'].includes(capturedSpeech.from)) {
            retryCapture = false;
          }
        } else {
          const raceResult = await Promise.race([
            _captureSpeechImpl(language),
            wait(remainingPauseLength),
          ]);
          capturedSpeech = raceResult ?? capturedSpeech;
          retryCapture = false;
        }
      } catch (error) {
        // catch any errors from captureSpeech(...)
        // chome throws no-speech if nothing picked up for ~8+ seconds
        if (error === 'no-speech') {
          const timeNow = Date.now();
          const timeDelta = timeNow - lastNoSpeechError;
          remainingPauseLength = Math.max(remainingPauseLength - timeDelta, 0);
          lastNoSpeechError = timeNow;
        }
        // don't retry on any other error -- something bad happened
        else {
          console.error(error);
          retryCapture = false;
        }
      }
    }

    // ensures speech capture has ended
    stopCapturingSpeech();

    // don't continue if speech recognition ended prematurely
    // this can result from skipping; can be resolved on resume however
    if (capturedSpeech.from === 'no-result') {
      resumePromiseRef.current = deferredPromise();
      (await resumePromiseRef.current.promise) as Promise<never>;
    }

    // nothing blocking us from continuing, return promise of result!
    // calculate outcome from spoken text and actual text
    const spokenText = capturedSpeech.transcript.trim().toLocaleLowerCase();
    return spokenText;
  }

  function _captureSpeechImpl(language: DeckLanguage) {
    // new instance makes things easier!
    speechRecognitionRef.current = getSpeechRecognitionObj();

    if (speechRecognitionRef.current === undefined) {
      throw new Error('unable to use speech recognition: speechRecognition object was undefined');
    }

    // `continuous` prevents onend from firing immediately even with background noises
    // note: it appears that speech recognition automatically ends after awhile of continuous?
    speechRecognitionRef.current.lang = getLanguageCode(language);
    speechRecognitionRef.current.continuous = true;
    speechRecognitionRef.current.start();
    setIsCapturingSpeech(true);

    return new Promise<CapturedSpeech>((resolve, reject) => {
      if (speechRecognitionRef.current === undefined) {
        reject('unable to use speech recognition: speechRecognition object was undefined');
        return;
      }

      let wasNoSpeechError = false;

      // Will only fire if the system can make a about the transcript above the confidence threshold
      speechRecognitionRef.current.onresult = (event) => {
        const resultsLength = event.results.length - 1;
        const ArrayLength = event.results[resultsLength].length - 1;
        const { transcript, confidence } = event.results[resultsLength][ArrayLength];
        resolve({ from: 'result', transcript, confidence });
      };

      // Always fires when disconnected
      speechRecognitionRef.current.onend = () => {
        resolve({ from: 'no-result', transcript: '', confidence: 0 });
        wasNoSpeechError === false && setIsCapturingSpeech(false);
      };

      speechRecognitionRef.current.onerror = (event) => {
        // no-speech gets fired after ~8 seconds of no sound, disconnecting the listener
        if (event.error === 'no-speech') {
          wasNoSpeechError = true;
        }

        if (event.error !== 'aborted') {
          reject(event.error);
        }
      };
    });
  }

  function resumeSpeechResult() {
    resumePromiseRef.current?.resolve();
  }

  // Stops the capturing of new speech, but it still allows the already captured material to be processed
  function stopCapturingSpeech() {
    setIsCapturingSpeech(false);
    speechRecognitionRef.current?.stop();
  }

  function abortSpeechCapture() {
    setIsCapturingSpeech(false);
    speechRecognitionRef.current?.abort();
  }

  function wait(time: number) {
    return new Promise<undefined>((resolve) => {
      setTimer(() => resolve(undefined), time);
    });
  }
}

function hasBrowserSupport(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const speechRecognitionCtor =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    (window as any).mozSpeechRecognition ||
    (window as any).msSpeechRecognition ||
    (window as any).oSpeechRecognition;

  return speechRecognitionCtor !== undefined;
}

function getSpeechRecognitionObj() {
  if (typeof window === 'undefined') {
    console.error('cannot create speech recognition object when window is undefined');
  }

  const speechRecognitionCtor =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    (window as any).mozSpeechRecognition ||
    (window as any).msSpeechRecognition ||
    (window as any).oSpeechRecognition;

  return speechRecognitionCtor ? new speechRecognitionCtor() : undefined;
}
