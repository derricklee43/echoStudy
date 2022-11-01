import { useRef, useState } from 'react';
import { CapturedSpeech } from '@/models/captured-speech';
import { DeckLanguage, getLanguageCode } from '@/models/language';

export function useCaptureSpeech() {
  const speechRecognitionRef = useRef(getSpeechRecognitionObj());
  const [isCapturingSpeech, setIsCapturingSpeech] = useState(false);

  return { captureSpeech, stopCapturingSpeech, abortSpeechCapture, isCapturingSpeech };

  function captureSpeech(language: DeckLanguage) {
    if (speechRecognitionRef.current === undefined) {
      throw new Error('unable to use speech recognition: speechRecognition object was undefined');
    }

    // `continuous` prevents onend from firing immediately even with background noises
    // note: it appears that speech recognition automatically ends after awhile of continuous?
    speechRecognitionRef.current = getSpeechRecognitionObj();
    speechRecognitionRef.current.lang = getLanguageCode(language);
    speechRecognitionRef.current.continuous = true;
    speechRecognitionRef.current.start();
    setIsCapturingSpeech(true);

    return new Promise<CapturedSpeech>((resolve, reject) => {
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

  // Stops the capturing of new speech, but it still allows the already captured material to be processed
  function stopCapturingSpeech() {
    setIsCapturingSpeech(false);
    speechRecognitionRef.current.stop();
  }

  function abortSpeechCapture() {
    setIsCapturingSpeech(false);
    speechRecognitionRef.current.abort();
  }
}

function getSpeechRecognitionObj() {
  if (typeof window === 'undefined') {
    console.error('cannot create speech recognition object when window is undefined');
  }
  return new (window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    (window as any).mozSpeechRecognition ||
    (window as any).msSpeechRecognition ||
    (window as any).oSpeechRecognition)();
}
